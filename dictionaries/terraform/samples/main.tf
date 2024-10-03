resource "aws_vpc" "main" {
    cidr_block       = "10.0.0.0/16"
    instance_tenancy = "default"

    tags = {
        Name = "main"
    }
}

resource "aws_subnet" "public" {
    vpc_id                          = "vpc-main"
    cidr_block                      = "10.0.1.0/24"
    ipv6_cidr_block                 = cidrsubnet(aws_vpc.main.ipv6_cidr_block, 8, 0)
    availability_zone               = "ap-southeast-1a"
    map_public_ip_on_launch         = true
    assign_ipv6_address_on_creation = true

    depends_on = [
        aws_vpc.main,
    ]
}
