provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "flora_sg" {
  name        = "flora-full-stack-sg"
  description = "Permite acesso SSH e portas da aplicacao (3000 e 8000)"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Flora-Security-Group"
  }
}

variable "key_name" {
  description = "Nome da chave SSH já criada na AWS"
  type        = string
  default     = "sua-chave-ssh"
}

resource "aws_instance" "flora_ec2" {
  ami           = "ami-0c7217cdde317cfec"
  instance_type = "t3.micro"
  # key_name      = var.key_name # Descomente apenas se criar uma chave na AWS

  vpc_security_group_ids = [aws_security_group.flora_sg.id]

  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  tags = {
    Name = "Flora-Full-Stack-Server"
  }

  user_data = <<-EOF
              #!/bin/bash
              
              apt-get update -y
              apt-get upgrade -y
              
              apt-get install -y ca-certificates curl gnupg git
              
              fallocate -l 2G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
              
              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg
              
              echo \
                "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
                tee /etc/apt/sources.list.d/docker.list > /dev/null
                
              apt-get update -y
              
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
              
              usermod -aG docker ubuntu
              
              systemctl start docker
              systemctl enable docker
              
              cd /home/ubuntu
              git clone https://github.com/iDevLopes011/Flora-Full-Stack.git
              
              cd Flora-Full-Stack
              
              TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
              PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/public-ipv4)
              echo "NEXT_PUBLIC_API_URL=http://$PUBLIC_IP:8000" > .env
              
              docker compose up -d --build
              EOF
}

output "flora_public_ip" {
  description = "IP Publico da EC2 para acessar o sistema"
  value       = aws_instance.flora_ec2.public_ip
}
