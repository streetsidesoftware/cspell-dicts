;;;; http://xahlee.info/emacs/emacs/elisp_examples.html

;;;; Insert Text
(defun my-insert-p-tag ()
  "Insert <p></p> at cursor point."
  (interactive)
  (insert "<p></p>")
  (backward-char 4))

;;;; Insert Around Region
(defun my-wrap-markup-region ()
  "Insert a markup <b></b> around a region."
  (interactive)
  (let ((p1 (region-beginning))
        (p2 (region-end)))
    (goto-char p2)
    (insert "</b>")
    (goto-char p1)
    (insert "<b>")))

;;;; Select Current Word

;; turn on highlight selection
(transient-mark-mode 1)

(defun my-select-current-word ()
  "Select the word under cursor.
“word” here is considered any alphanumeric sequence with “_” or “-”."
  (interactive)
  (let (pt)
    (skip-chars-backward "-_A-Za-z0-9")
    (setq pt (point))
    (skip-chars-forward "-_A-Za-z0-9")
    (set-mark pt)))

;;;; Find Replace String in Region

(defun my-replace-greek-region ()
  "Replace “alpha” to “α” and other greek letters in current region."
  (interactive)
  (let (
        (p1 (region-beginning))
        (p2 (region-end)))
    (save-restriction
      (narrow-to-region p1 p2)
      (goto-char (point-min))
      (while (search-forward " alpha" nil t)
        (replace-match " α" nil t))
      (goto-char (point-min))
      (while (search-forward " beta" nil t)
        (replace-match " β" nil t))
      (goto-char (point-min))
      (while (search-forward " gamma" nil t)
        (replace-match " γ" nil t)))))
