# 📋 Avaliação Técnica

## Engenheiro de Software Full-Stack

### Instruções

Esta avaliação tem o objetivo de aferir seus conhecimentos em programação e validar padrões de qualidade de software exigidos pela Flora. Ela é composta por duas etapas: **perguntas de múltipla escolha** e um **teste prático**.

As perguntas estão listadas logo abaixo das instruções e é permitido consultar materiais de apoio para responder.

O teste prático contém instruções específicas e deve ser acessado através do link:
🔗 [TechTests - Flora Energia](https://github.com/reloadfloraenergia/TechTests)

A partir de agora você tem até **4 dias** para enviar todas as respostas desta avaliação e informar o link do repositório referente ao teste prático, encaminhando tudo em um documento PDF por aqui mesmo.

Em caso de dúvidas, envie uma mensagem para:
- 📧 thaisa.ponzio@floraenergia.com.br
- 📧 emmanuel.matheus@floraenergia.com.br

**Boa sorte!** 🍀

---

## Questões Objetivas

---

### Questão 1 — Message Broker

Considere o seguinte trecho de código em Node.js:

```javascript
const messageBroker = require('./messageBroker');
const handleMessage = require('./handleMessage');

messageBroker.subscribe('topic', (message) => {
  try {
    handleMessage(message);
    messageBroker.ack(message);
  } catch (error) {
    messageBroker.nack(message);
  }
});
```

**Qual das seguintes afirmações é verdadeira sobre esse código?**

- [ ] O código usa o RabbitMQ como broker de mensagens, pois usa os métodos `ack` e `nack` para confirmar ou rejeitar as mensagens
- [ ] O código usa o Kafka como broker de mensagens, pois usa o método `subscribe` para se inscrever em um tópico
- [x] O código pode usar tanto o RabbitMQ quanto o Kafka como broker de mensagens, pois ambos suportam os conceitos de tópicos, confirmações e rejeições de mensagens
- [ ] O código não pode usar nem o RabbitMQ nem o Kafka como broker de mensagens, pois ambos exigem a especificação de um grupo de consumidores ao se inscrever em um tópico
- [ ] Nenhuma das alternativas anteriores

---

### Questão 2 — Microserviços e Boas Práticas

**Qual das seguintes afirmações é *falsa* sobre as melhores práticas de garantir a qualidade e a entrega contínua em um contexto de microserviços Node.js?**

- [ ] Cada microserviço deve ser pequeno e focado em uma função específica do negócio
- [ ] Cada microserviço deve usar I/O assíncrono para lidar com um alto número de conexões com baixo consumo de recursos
- [x] Cada microserviço deve usar um banco de dados relacional como o MySQL ou o PostgreSQL para armazenar seus dados
- [ ] Cada microserviço deve usar um broker de mensagens como o RabbitMQ ou o Kafka para lidar com a comunicação entre serviços
- [ ] Cada microserviço deve usar uma tecnologia de containerização como o Docker para empacotar e implantar serviços

---

### Questão 3 — API Gateway

Considere o seguinte trecho de código que implementa um API Gateway usando o módulo `express-gateway` em Node.js. Esse API Gateway é responsável por rotear as solicitações para diferentes microserviços que compõem uma aplicação web.

```javascript
const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const apiProxy = httpProxy.createProxyServer();

app.all("/service1/*", (req, res) => {
  apiProxy.web(req, res, { target: 'http://localhost:3001' });
});

app.all("/service2/*", (req, res) => {
  apiProxy.web(req, res, { target: 'http://localhost:3002' });
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
```

**Quais das seguintes afirmações são verdadeiras sobre esse código?**

- [ ] O código está configurando um balanceamento de carga entre múltiplos microserviços
- [ ] Está criando um ESB (Enterprise Service Bus) para integrar diferentes microserviços
- [x] O código implementa um API Gateway que roteia solicitações para diferentes microserviços baseados em suas rotas
- [ ] Estabelece um Service Mesh para gerenciamento de comunicação entre microserviços
- [ ] O trecho de código representa uma configuração de Circuit Breaker para microserviços

---

### Questão 4 — MongoDB / Mongoose

Considere o seguinte trecho de código:

```javascript
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const User = mongoose.model('User', userSchema);
```

**Qual das opções deve ser usada para encontrar todos os usuários com mais de 18 anos?**

- [x] `User.find({ age: { $gt: 18 } })`
- [ ] `User.find({ age: { $lt: 18 } })`
- [ ] `User.find({ age: 18 })`
- [ ] `User.find({ age: { $eq: 18 } })`

---

### Questão 5 — Event Loop

**Dadas as informações abaixo, aponte quais estão corretas:**

- [x] O event loop é responsável por coordenar a execução de callbacks e outras tarefas assíncronas
- [ ] O event loop é responsável por coordenar a execução de operações síncronas
- [x] O event loop funciona em conjunto com outras partes do sistema, como o pool de threads e o sistema operacional
- [ ] O event loop funciona independentemente das outras partes do sistema, como o pool de threads e o sistema operacional
- [x] Entender o funcionamento interno do event loop pode ajudar a otimizar o desempenho de aplicações Node.js
- [ ] Entender o funcionamento interno do event loop não tem impacto no desempenho de aplicações Node.js. Streaming e Buffers