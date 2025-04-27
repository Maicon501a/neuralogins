# Neuralogins
[![GitHub](https://img.shields.io/badge/GitHub-repo-blue?logo=github)](https://github.com/Maicon501a/neuralogins)
Biblioteca JavaScript para integrar seu projeto ao Sistema de Login Multi-Tenant.

## Instalação

```bash
npm install neuralogins
# ou
yarn add neuralogins
# ou direto do GitHub
npm install git+https://github.com/Maicon501a/neuralogins.git
```

### Requisitos
- Node.js >= 14.x

### Criar sua API Key
Antes de usar o SDK, crie uma API Key no seu painel:
1. Acesse https://login.seuservidor.com e faça login com sua conta.
2. No menu, clique em **API Keys**.
3. Clique em **Criar nova chave**, preencha o **nome do projeto** e **label do site**.
4. Copie a **chave** gerada.

#### Definindo a variável de ambiente

No Linux/macOS:

```bash
export LOGIN_API_KEY="sua-api-key-aqui"
```

No Windows (PowerShell):

```powershell
$Env:LOGIN_API_KEY="sua-api-key-aqui"
```

## Início Rápido

```js
import { SistemaLoginClient } from 'neuralogins';

(async () => {
  // Inicializa usando apenas a API Key (criada no admin UI)
  const client = await SistemaLoginClient.initWithApiKey({
    apiUrl: 'https://login.seuservidor.com',         // seu servidor de login
    apiKey: 'SUA_API_KEY_AQUI'                       // chave gerada no dashboard
  });

  // A instância já tem:
  console.log(client.profile);       // { id, email }
  console.log(client.projectName);   // nome do projeto associado
  console.log(client.siteLabel);     // label do site

  // Agora pode usar todos os métodos do SDK:
  await client.createSecureData({ data: 'seu dado secreto' });
  // ou client.generateApiKey(), client.getSecureData(), etc.
})();
```

## Recursos e Métodos

| Método               | Parâmetros                       | Retorno                                           | Descrição                                                |
|----------------------|----------------------------------|---------------------------------------------------|----------------------------------------------------------|
| register             | `{ name, email, password }`      | `Promise<void>`                                   | Registra novo usuário e retorna token e API Key         |
| login                | `{ email, password }`            | `Promise<{token, apiKey, name, email, message}>`  | Autentica usuário e guarda token para chamadas futuras   |
| logout               | `()`                             | `Promise<void>`                                   | Invalida a sessão (refresh token)                       |
| getProfile           | `()`                             | `Promise<{id, name, email, siteId, createdAt}>`   | Retorna dados do usuário autenticado                    |
| updateProfile        | `{ name, email }`                | `Promise<void>`                                   | Atualiza nome e email (válido apenas uma vez)           |
| requestPasswordReset | `email`                          | `Promise<void>`                                   | Envia email para reset de senha                          |
| resetPassword        | `{ email, token, newPassword }`  | `Promise<void>`                                   | Redefine senha com token recebido por email             |
| generateApiKey       | `{ email, project, site }`       | `Promise<{ key }>`                                | Gera API Key para acesso server-to-server               |
| listApiKeys          | `()`                             | `Promise<Array>`                                  | Lista todas as chaves do tenant                          |
| deleteApiKey         | `key`                            | `Promise<void>`                                   | Exclui chave passada por UUID                            |
| createSecureData     | `{ data }`                       | `Promise<{ id, createdAt }>`                     | Cria dados criptografados no servidor                    |
| getSecureData        | `()`                             | `Promise<Array>`                                  | Retorna dados protegidos armazenados                     |
| deleteSecureData     | `id`                             | `Promise<void>`                                   | Remove dado criptografado pelo ID                        |

## Licença
MIT
