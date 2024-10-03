#!/usr/bin/env sh

# Fail on error
set -o errexit
# Disable wildcard character expansion
set -o noglob

# ================
# GLOBALS
# ================
# Downloader
DOWNLOADER=
# Temporary directory
TMP_DIR=

# ================
# CLEANUP
# ================
cleanup() {
  # Exit code
  _exit_code=$?
  [ $_exit_code = 0 ] || WARN "Cleanup exit code $_exit_code"

  # Cleanup temporary directory
  cleanup_dir "$TMP_DIR"

  exit "$_exit_code"
}

# Cleanup directory
# @param $1 Directory path
cleanup_dir() {
  { [ -n "$1" ] && [ -d "$1" ]; } || return 0

  DEBUG "Removing directory '$1'"
  rm -rf "$1" || return 0
}

# Trap
trap cleanup INT QUIT TERM EXIT

# ================
# LOGGER
# ================
# Fatal log level. Cause exit failure
LOG_LEVEL_FATAL=100
# Error log level
LOG_LEVEL_ERROR=200
# Warning log level
LOG_LEVEL_WARN=300
# Informational log level
LOG_LEVEL_INFO=500
# Debug log level
LOG_LEVEL_DEBUG=600
# Log level
LOG_LEVEL=$LOG_LEVEL_INFO
# Log color flag
LOG_COLOR_ENABLE=true

# Convert log level to equivalent name
# @param $1 Log level
to_log_level_name() {
  _log_level=${1:-LOG_LEVEL}
  _log_level_name=

  case $_log_level in
    "$LOG_LEVEL_FATAL") _log_level_name=fatal ;;
    "$LOG_LEVEL_ERROR") _log_level_name=error ;;
    "$LOG_LEVEL_WARN") _log_level_name=warn ;;
    "$LOG_LEVEL_INFO") _log_level_name=info ;;
    "$LOG_LEVEL_DEBUG") _log_level_name=debug ;;
    *) FATAL "Unknown log level '$_log_level'" ;;
  esac

  printf '%s\n' "$_log_level_name"
}

# Check if log level is enabled
# @param $1 Log level
is_log_level_enabled() {
  [ "$1" -le "$LOG_LEVEL" ]

  return $?
}

# Print log message
# @param $1 Log level
# @param $2 Message
_log_print_message() {
  _log_level=${1:-LOG_LEVEL_FATAL}
  shift
  _log_level_name=
  _log_message=${*:-}
  _log_prefix=
  _log_suffix="\033[0m"

  # Check log level
  is_log_level_enabled "$_log_level" || return 0

  case $_log_level in
    "$LOG_LEVEL_FATAL")
      _log_level_name=FATAL
      _log_prefix="\033[41;37m"
      ;;
    "$LOG_LEVEL_ERROR")
      _log_level_name=ERROR
      _log_prefix="\033[1;31m"
      ;;
    "$LOG_LEVEL_WARN")
      _log_level_name=WARN
      _log_prefix="\033[1;33m"
      ;;
    "$LOG_LEVEL_INFO")
      _log_level_name=INFO
      _log_prefix="\033[37m"
      ;;
    "$LOG_LEVEL_DEBUG")
      _log_level_name=DEBUG
      _log_prefix="\033[1;34m"
      ;;
  esac

  # Check color flag
  if [ "$LOG_COLOR_ENABLE" = false ]; then
    _log_prefix=
    _log_suffix=
  fi

  # Log
  printf '%b[%-5s] %b%b\n' "$_log_prefix" "$_log_level_name" "$_log_message" "$_log_suffix"
}

# Fatal log message
# @param $1 Message
FATAL() {
  _log_print_message "$LOG_LEVEL_FATAL" "$1" >&2
  exit 1
}
# Error log message
# @param $1 Message
ERROR() { _log_print_message "$LOG_LEVEL_ERROR" "$1" >&2; }
# Warning log message
# @param $1 Message
WARN() { _log_print_message "$LOG_LEVEL_WARN" "$1" >&2; }
# Informational log message
# @param $1 Message
INFO() { _log_print_message "$LOG_LEVEL_INFO" "$1"; }
# Debug log message
# @param $1 Message
DEBUG() { _log_print_message "$LOG_LEVEL_DEBUG" "$1"; }

# ================
# ASSERT
# ================
# Assert command is installed
# @param $1 Command name
assert_cmd() {
  check_cmd "$1" || FATAL "Command '$1' not found"
  DEBUG "Command '$1' found at '$(command -v "$1")'"
}

# Assert executable downloader
assert_downloader() {
  [ -z "$DOWNLOADER" ] || return 0

  _assert_downloader() {
    check_cmd "$1" || return 1

    # Set downloader
    DOWNLOADER=$1
    return 0
  }

  # Downloader command
  _assert_downloader curl \
    || _assert_downloader wget \
    || FATAL "No executable downloader found: 'curl' or 'wget'"
  DEBUG "Downloader '$DOWNLOADER' found at '$(command -v "$DOWNLOADER")'"
}

# Assert URL is reachable
# @param $1 URL address
# @param $2 Timeout in seconds
assert_url_reachability() {
  # URL address
  _url_address=$1
  # Timeout in seconds
  _timeout=${2:-10}

  DEBUG "Testing URL '$_url_address' reachability"
  case $DOWNLOADER in
    curl)
      curl --fail --silent --show-error --max-time "$_timeout" "$_url_address" > /dev/null || FATAL "URL address '$_url_address' is unreachable"
      ;;
    wget)
      wget --quiet --spider --timeout="$_timeout" --tries=1 "$_url_address" 2>&1 || FATAL "URL address '$_url_address' is unreachable"
      ;;
    *) FATAL "Unknown downloader '$DOWNLOADER'" ;;
  esac
}

# ================
# FUNCTIONS
# ================
# Show help message
show_help() {
  cat << EOF
Usage: $(basename "$0") [--definitions <URL>] [--disable-color] [--help] [--log-level <LEVEL>] [--out-file <FILE>]

K8s dictionary build script.

Options:
  --definitions <URL>  K8s definitions URL
                       Default: $K8S_DEFINITIONS_URL
                       Values:
                         Any valid URL

  --disable-color      Disable color

  --help               Show this help message and exit

  --log-level <LEVEL>  Logger level
                       Default: $(to_log_level_name "$LOG_LEVEL")
                       Values:
                         fatal    Fatal level
                         error    Error level
                         warn     Warning level
                         info     Informational level
                         debug    Debug level

  --out-file <FILE>    Output file
                       Default: $OUT_FILE
                       Values:
                         Any valid file
EOF
}

# Check command is installed
# @param $1 Command name
check_cmd() {
  command -v "$1" > /dev/null 2>&1
}

# Download a file
# @param $1 Output location
# @param $2 Download URL
download() {
  DEBUG "Downloading file '$2' to '$1'"

  case $DOWNLOADER in
    curl)
      curl --fail --silent --location --output "$1" "$2" || FATAL "Download file '$2' failed"
      ;;
    wget)
      wget --quiet --output-document="$1" "$2" || FATAL "Download file '$2' failed"
      ;;
    *) FATAL "Unknown downloader '$DOWNLOADER'" ;;
  esac

  DEBUG "Successfully downloaded file '$2' to '$1'"
}

################################################################################################################################

# Parse command line arguments
# @param $@ Arguments
parse_args() {
  parse_args_assert_value() {
    [ -n "$2" ] || FATAL "Argument '$1' requires a non-empty value"
  }

  while [ $# -gt 0 ]; do
    case $1 in
      --definitions)
        # K8s definitions URL
        parse_args_assert_value "$@"

        K8S_DEFINITIONS_URL=$2
        shift
        shift
        ;;
      --disable-color)
        # Disable color
        LOG_COLOR_ENABLE=false
        shift
        ;;
      --help)
        # Display help message and exit
        show_help
        exit 0
        ;;
      --log-level)
        # Log level
        parse_args_assert_value "$@"

        case $2 in
          fatal) LOG_LEVEL=$LOG_LEVEL_FATAL ;;
          error) LOG_LEVEL=$LOG_LEVEL_ERROR ;;
          warn) LOG_LEVEL=$LOG_LEVEL_WARN ;;
          info) LOG_LEVEL=$LOG_LEVEL_INFO ;;
          debug) LOG_LEVEL=$LOG_LEVEL_DEBUG ;;
          *) FATAL "Value '$2' of argument '$1' is invalid" ;;
        esac
        shift
        shift
        ;;
      --out-file)
        # Output file
        parse_args_assert_value "$@"

        OUT_FILE=$2
        shift
        shift
        ;;
      -*)
        # Unknown argument
        WARN "Unknown argument '$1' is ignored"
        shift
        ;;
      *)
        # No argument
        WARN "Skipping argument '$1'"
        shift
        ;;
    esac
  done
}

# Verify system
verify_system() {
  assert_cmd jq
  assert_downloader
  assert_url_reachability "$K8S_DEFINITIONS_URL"

  [ ! -f "$OUT_FILE" ] || WARN "Output file '$OUT_FILE' already exists"
}

# Setup system
setup_system() {
  # Temporary directory
  TMP_DIR=$(mktemp -d)
  DEBUG "Created temporary directory '$TMP_DIR'"
}

# Build dictionary
build_dictionary() {
  _k8s_definitions_file="$TMP_DIR/k8s.definitions.json"
  _k8s_dictionary_file="$TMP_DIR/k8s.dictionary.txt"

  INFO "Downloading K8s definitions file from '$K8S_DEFINITIONS_URL' to '$_k8s_definitions_file'"
  download "$_k8s_definitions_file" "$K8S_DEFINITIONS_URL"

  INFO "Analyzing K8s definitions file '$_k8s_definitions_file'"
  jq \
    --raw-output \
    '
      [
        ..
        | .properties?
        | objects
        | to_entries[]
        | .key
      ]
      | unique
      | sort
      | .[]
    ' \
    "$_k8s_definitions_file" > "$_k8s_dictionary_file"

  INFO "Saving K8s dictionary to '$OUT_FILE'"
  mv "$_k8s_dictionary_file" "$OUT_FILE"
}

# ================
# CONFIGURATION
# ================
# K8s definitions URL
K8S_DEFINITIONS_URL='https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/master-standalone/_definitions.json'
# Log level
LOG_LEVEL=$LOG_LEVEL_INFO
# Log color flag
LOG_COLOR_ENABLE=true
# Output file
OUT_FILE="words.txt"

# ================
# MAIN
# ================
{
  parse_args "$@"
  verify_system
  setup_system
  build_dictionary
}
