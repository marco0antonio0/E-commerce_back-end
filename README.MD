
# Teste Desenvolvedor(a) JR - Back End E-commerce

### Projeto acess endpoints

- [Acesso Endpoints](https://e-commerce-api.dirrocha.com/api-docs)
- [Acesso phpMyAdmin](https://e-commerce-php.dirrocha.com/)
- [Acesso Swaggger docs web](https://e-commerce-api.dirrocha.com/api-docs)

### Acesso rapido a docs readme

- [Estrutura do projeto](#estrutura-do-projeto)
- [Documentação-dos-endpoints](#documentação-dos-endpoints)
- [Como acessar a documentação swagger](#acessando-a-documentação-da-api)

Este projeto é uma aplicação de e-commerce desenvolvida para o teste de Desenvolvedor(a) JR. O back-end foi construído utilizando NestJS e inclui funcionalidades de autenticação, gerenciamento de carrinho e integração com APIs de fornecedores para listar produtos.

## Tecnologias Utilizadas

- **NestJS**: Framework para a construção de aplicações Node.js escaláveis e eficientes.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Swagger**: Ferramenta para documentação de APIs.
- **JWT (JSON Web Token)**: Método de autenticação.
- **Sequelize**: ORM (Object Relational Mapping) para interagir com o banco de dados.
- **rate-limit**: Middleware para limitar a taxa de requisições.
- **class-validator**: Biblioteca para validação de classes.

## Funcionalidades

- **Autenticação JWT**: Implementação de autenticação segura utilizando tokens JWT.
- **Gerenciamento de Carrinho**: Adicionar, atualizar, remover e listar itens do carrinho.
- **Registro de Usuário**: Registro de novos usuários.
- **Login de Usuário**: Autenticação de usuários existentes.
- **APIs de Produtos**: Integração com APIs de fornecedores para listar produtos.

## Como Executar o Projeto

### Pré-requisitos

- **Node.js**: Instale a versão LTS mais recente de [Node.js](https://nodejs.org/).
- **NestJS CLI**: Instale o CLI do NestJS globalmente:

  ```sh
  npm install -g @nestjs/cli
  ```

- **Banco de Dados**: Configure um banco de dados PostgreSQL.

### Passos para Configuração

1. **Clone o repositório:**

   ```sh
   git clone <https://github.com/seu-usuario/seu-repositorio.git>
   cd seu-repositorio
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

3. **Configuração do Banco de Dados:**
   - Crie um arquivo `.env` na raiz do projeto e configure suas variáveis de ambiente conforme o exemplo abaixo:

    ```env
    DB_HOST='localhost'
    DB_PORT='3306'
    PORT='3000'
    DB_USER='you_user'
    DB_ROOT_USER='root'
    DB_PASSWORD='your_password'
    DB_DATABASE='empreendimento'
    SECRET_KEY='your_env'
    PROD='false'
    ```

4. **Execute as migrações do banco de dados:**

   ```sh
   npx sequelize-cli db:migrate
   ```

5. **Inicie o servidor:**

   ```sh
   npm run start
   ```

6. **Acesse a documentação da API:**
   - A documentação do Swagger estará disponível em <http://localhost:3000/api-docs>

### Estrutura do Projeto

```plaintext
├── src/
│   ├── auth/
│   │   ├── models/
│   │   │   └── token.dto.ts
│   │   ├── services/
│   │   │   ├── abstract-auth.service.ts
│   │   │   └── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── config/
│   │   └── databasse.config.ts
│   │
│   ├── guard/
│   │   └── jwt-auth.guard.ts
│   │
│   ├── cart/
│   │   ├── controllers/
│   │   │   └── cart.controller.ts
│   │   ├── models/
│   │   │   └── cart.dto.ts
│   │   ├── repositories/
│   │   │   ├── entity/
│   │   │   │   └── cart.entity.ts
│   │   │   ├── abstract-repository-cart.service.ts
│   │   │   └── repository-cart.service.ts
│   │   ├── services/
│   │   │   ├── cart.service.ts
│   │   │   └── abstract-cart.service.ts
│   │   └── cart.module.ts
│   │
│   ├── products/
│   │   ├── controllers/
│   │   │   └── products.controller.ts
│   │   ├── services/
│   │   │   ├── abstract-products.service.ts
│   │   │   └── products.service.ts
│   │   └── products.module.ts
│   │
│   └── user/
│       ├── controllers/
│       │   └── user.controller.ts
│       ├── models/
│       │   ├── user-models.dto.ts
│       │   └── user.dto.ts
│       ├── repositories/
│       │   ├── entity/
│       │   │   └── user.entity.ts
│       │   ├── abstract-repository-user.service.ts
│       │   └── repository-user.service.ts
│       ├── services/
│       │   ├── user.service.ts
│       │   └── abstract-user.service.ts
│       └── user.module.ts
│
├── app.module.ts
├── main.ts
├── test/
├── docker-compose.yml
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
└── .swcrc
```

# Documentação dos Endpoints

## UserController

### POST /user/login

#### Descrição

Autenticação de usuário.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Respostas

- **200 OK**: Login bem-sucedido.

  ```json
  {
    "token": "jwt_token"
  }
  ```

- **401 Unauthorized**: Credenciais inválidas.

### POST /user/register

#### Descrição

Registro de um novo usuário.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Respostas

- **201 Created**: Registro bem-sucedido.

  ```json
  {
    "token": "jwt_token"
  }
  ```

## ProductsController

### GET /products

#### Descrição

Recupera todos os produtos.

#### Respostas

- **200 OK**: Lista de todos os produtos.

  ```json
  [
    {
      "id": "1",
      "name": "Product 1",
      "description": "This is product 1",
      "price": 100
    },
    {
      "id": "2",
      "name": "Product 2",
      "description": "This is product 2",
      "price": 200
    }
  ]
  ```

### GET /products/:id

#### Descrição

Recupera um produto pelo ID.

#### Parâmetros

- `id`: ID do produto.

#### Respostas

- **200 OK**: Produto com o ID especificado.

  ```json
  {
    "id": "1",
    "name": "Product 1",
    "description": "This is product 1",
    "price": 100
  }
  ```

- **404 Not Found**: Produto não encontrado.

## CartController

### POST /cart

#### Descrição

Adiciona um item ao carrinho.

#### Request Body

```json
{
  "productId": "1",
  "quantity": 1
}
```

#### Respostas

- **201 Created**: Item adicionado ao carrinho com sucesso.

  ```json
  {
    "id": "1",
    "productId": "1",
    "quantity": 1,
    "userEmail": "user@example.com"
  }
  ```

- **401 Unauthorized**: Campo de e-mail não pode ser nulo.

### GET /cart

#### Descrição

Recupera todos os itens no carrinho.

#### Respostas

- **200 OK**: Itens do carrinho recuperados com sucesso.

  ```json
  [
    {
      "id": "1",
      "productId": "1",
      "quantity": 1,
      "userEmail": "user@example.com"
    },
    {
      "id": "2",
      "productId": "2",
      "quantity": 2,
      "userEmail": "user@example.com"
    }
  ]
  ```

- **401 Unauthorized**: Não autorizado.

### PATCH /cart/:productId

#### Descrição

Atualiza um item no carrinho.

#### Parâmetros

- `productId`: ID do produto.

#### Request Body

```json
{
  "quantity": 2
}
```

#### Respostas

- **200 OK**: Item do carrinho atualizado com sucesso.

  ```json
  {
    "id": "1",
    "productId": "1",
    "quantity": 2,
    "userEmail": "user@example.com"
  }
  ```

- **401 Unauthorized**: Campo de e-mail não pode ser nulo.

### DELETE /cart/:productId

#### Descrição

Remove um item do carrinho.

#### Parâmetros

- `productId`: ID do produto.

#### Respostas

- **204 No Content**: Item do carrinho removido com sucesso.
- **401 Unauthorized**: Não autorizado.

### DELETE /cart/clear

#### Descrição

Limpa todos os itens do carrinho.

#### Respostas

- **204 No Content**: Carrinho limpo com sucesso.
- **401 Unauthorized**: Não autorizado.

### POST /cart/finalize

#### Descrição

Finaliza a compra.

#### Respostas

- **200 OK**: Compra finalizada com sucesso.
- **401 Unauthorized**: Não autorizado.

# Acessando a Documentação da API

Para acessar a documentação interativa da API, você pode utilizar o Swagger. A documentação estará disponível em:

```
http://localhost:3000/api-docs
```

A partir dessa URL, você poderá explorar e testar os endpoints da API de maneira intuitiva.
