# Claude Code Workflow - Suggestiss Next.js

## Lint Workflow

### Quando executar o lint:

1. **Antes de fazer commit**
   - Sempre rode `npm run lint` antes de commitar código
   - Corrija todos os erros e warnings apontados

2. **Após modificar arquivos**
   - Ao criar ou editar componentes React
   - Ao modificar arquivos de configuração
   - Ao adicionar novos hooks ou utils

3. **Antes de criar Pull Request**
   - Garanta que não há erros de lint
   - Código deve passar em todas as verificações

### Boas práticas de código:

#### 1. Imports e Exports
- Remova imports não utilizados
- Organize imports: React → bibliotecas → arquivos locais
- Use named exports quando possível

```typescript
// ✅ Bom
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ❌ Evite
import React from 'react' // desnecessário no Next.js
```

#### 2. Variáveis e Constantes
- Não declare variáveis não utilizadas
- Use `const` por padrão, `let` apenas quando necessário
- Evite `var`

```typescript
// ✅ Bom
const userName = 'João'
console.log(userName)

// ❌ Evite
const unusedVar = 'teste' // variável não usada
var oldStyle = 'use const ou let'
```

#### 3. Comparações
- Sempre use `===` e `!==` (strict equality)
- Evite `==` e `!=`

```typescript
// ✅ Bom
if (age === 18) { }
if (name !== '') { }

// ❌ Evite
if (age == 18) { }
if (name != '') { }
```

#### 4. Console Statements
- Remova `console.log` antes de commit em produção
- Use apenas para debugging local
- Considere usar logger adequado para produção

#### 5. Async/Await
- Sempre use try/catch com async/await
- Trate erros adequadamente

```typescript
// ✅ Bom
try {
  const data = await fetchData()
  return data
} catch (error) {
  console.error('Error fetching data:', error)
  throw error
}

// ❌ Evite
const data = await fetchData() // sem tratamento de erro
```

#### 6. TypeScript
- Defina tipos explícitos quando necessário
- Evite `any`, use `unknown` se necessário
- Use interfaces para props de componentes

```typescript
// ✅ Bom
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

// ❌ Evite
const props: any = { }
```

#### 7. React Hooks
- Siga as regras dos hooks (não use em condicionais)
- Declare dependências corretas no useEffect
- Use useMemo e useCallback quando necessário

```typescript
// ✅ Bom
useEffect(() => {
  fetchData()
}, [dependency])

// ❌ Evite
useEffect(() => {
  fetchData()
}) // dependências faltando
```

#### 8. Componentes
- Um componente por arquivo (exceto componentes muito pequenos)
- Use nomes PascalCase para componentes
- Exporte no final do arquivo

```typescript
// ✅ Bom
export function UserProfile({ user }: UserProfileProps) {
  return <div>{user.name}</div>
}

// ❌ Evite
export default function userprofile(props: any) { }
```

### Comandos úteis:

```bash
# Verificar erros de lint
npm run lint

# Auto-fix problemas simples (se configurado)
npm run lint -- --fix

# Verificar tipos TypeScript
npx tsc --noEmit
```

### Checklist antes de commit:

- [ ] `npm run lint` sem erros
- [ ] Código TypeScript compila sem erros
- [ ] Imports não utilizados removidos
- [ ] Console.logs de debug removidos
- [ ] Comentários úteis adicionados (se necessário)
- [ ] Código testado localmente

### Regras de commit:

- **NUNCA mencione "Claude Code" ou ferramentas de IA nas mensagens de commit**
- Use mensagens objetivas e técnicas
- Formato: `tipo: descrição curta` (ex: `fix:`, `feat:`, `docs:`, `config:`)
- Mantenha mensagens concisas e profissionais

---

## Estrutura do Projeto

### Diretórios principais:
- `app/` - Pages e layouts (App Router)
- `components/` - Componentes React reutilizáveis
- `hooks/` - Custom hooks
- `services/` - Integrações com APIs (Gemini, Redis, etc)
- `contexts/` - React Context providers
- `utils/` - Funções auxiliares
- `types/` - Definições TypeScript
- `locales/` - Traduções i18n
- `config/` - Configurações da aplicação
- `public/` - Assets estáticos

### Convenções de nomenclatura:
- Componentes: `PascalCase.tsx` (ex: `Button.tsx`)
- Hooks: `camelCase.ts` com prefixo `use` (ex: `useLocalStorage.ts`)
- Utils: `camelCase.ts` (ex: `formatDate.ts`)
- Types: `PascalCase.ts` ou arquivo único `types.ts`
- Contexts: `PascalCase.tsx` com sufixo `Context` (ex: `ThemeContext.tsx`)

---

## Configuração do Ambiente

### Variáveis de ambiente obrigatórias:
- `GEMINI_API_KEY` - API do Google Gemini
- `UPSTASH_REDIS_REST_TOKEN` - Token do Redis
- `UPSTASH_REDIS_REST_URL` - URL do Redis
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics PostHog
- `NEXT_PUBLIC_POSTHOG_HOST` - Host PostHog

### Porta padrão:
- Desenvolvimento: **5000** (`npm run dev`)
- Produção: **5000** (`npm start`)

---

**Última atualização:** 2025-01-15
