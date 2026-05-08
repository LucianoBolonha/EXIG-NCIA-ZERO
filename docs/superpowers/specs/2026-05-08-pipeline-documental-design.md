# Pipeline Documental Design

**Data:** 2026-05-08

**Objetivo**

Definir o primeiro subsistema implementável do Exigencia Zero como um slice completo web para upload de documentos, processamento de OCR com Azure AI Document Intelligence e conferência do texto extraído pelo usuário.

## 1. Escopo

Este design cobre apenas o primeiro ciclo do MVP:

- upload de arquivos `PDF`, `PNG` e `JPG`;
- validação básica de tipo e tamanho do arquivo;
- envio do documento para OCR;
- extração e normalização do texto;
- exibição do texto extraído para conferência em interface web;
- exibição de estados de carregamento, sucesso, baixa confiança e erro.

Este design não cobre neste ciclo:

- autenticação;
- persistência em banco;
- histórico;
- segmentação de exigências;
- checklist de providências;
- sugestão de minuta;
- exportação;
- integração com outros sistemas.

## 2. Decisões fechadas

- `OCR`: Azure AI Document Intelligence.
- `Formatos aceitos`: `PDF`, `PNG` e `JPG`.
- `Entrega`: slice completo web.
- `Stack web`: `Next.js` com `React`.
- `Estratégia arquitetural`: app full-stack em `Next.js` com camada de domínio isolada.

## 3. Objetivo funcional do slice

O usuário deve conseguir enviar um documento imobiliário em formato suportado, aguardar o processamento e visualizar em tela o texto extraído com sinalização clara de eventuais limitações da leitura.

O foco deste ciclo é validar o risco central do produto:

- receber documentos reais;
- extrair texto utilizável;
- apresentar uma experiência confiável de conferência.

## 4. Arquitetura proposta

O sistema será implementado como um app `Next.js` com `App Router`, combinando interface web e rotas internas de API no mesmo projeto. A lógica de negócio não ficará acoplada às rotas nem à interface, mas concentrada em módulos internos separados.

### 4.1 Blocos principais

#### Interface web

Uma página principal será responsável por:

- permitir upload do arquivo;
- mostrar instruções de uso;
- exibir estados de `idle`, `uploading`, `processing`, `success` e `error`;
- renderizar a tela de conferência com o texto extraído;
- exibir avisos de baixa confiança quando necessário.

#### Rota de API interna

Uma rota do próprio `Next.js` receberá o arquivo via `multipart/form-data`, validará a entrada e chamará a camada de aplicação.

Essa rota deve:

- rejeitar arquivos inválidos rapidamente;
- delegar o processamento ao caso de uso;
- transformar erros internos em respostas HTTP consistentes;
- devolver um payload estável para a interface.

#### Camada de aplicação

O caso de uso principal será `processDocumentForReview`.

Ele será responsável por:

- validar regras de entrada;
- acionar o adapter de OCR;
- normalizar a resposta do provedor;
- calcular um indicador simples de confiança;
- produzir o resultado final esperado pela UI.

#### Adapter de OCR

O acesso ao `Azure AI Document Intelligence` ficará encapsulado em um adapter dedicado.

Esse adapter deve:

- autenticar com a Azure por variáveis de ambiente;
- enviar o documento para processamento;
- realizar polling até obter o resultado;
- transformar a resposta bruta da Azure em um formato interno previsível.

## 5. Fluxo de dados

1. o usuário seleciona um arquivo na interface;
2. o frontend envia o arquivo para a rota de processamento;
3. a rota valida o tipo e o tamanho do arquivo;
4. a rota delega para `processDocumentForReview`;
5. o caso de uso chama o adapter do Azure OCR;
6. o adapter processa o documento e devolve o texto extraído com metadados;
7. o caso de uso normaliza o conteúdo e calcula o sinal de confiança;
8. a rota devolve a resposta para o frontend;
9. a interface exibe a conferência do texto ou o erro correspondente.

## 6. Contrato funcional da saída

O primeiro slice deve retornar para a interface, no mínimo:

- nome do arquivo;
- tipo do arquivo;
- status do processamento;
- texto extraído consolidado;
- indicador simples de confiança;
- mensagem de aviso quando a leitura for fraca;
- mensagem de erro quando o processamento falhar.

## 7. Regras do primeiro ciclo

### 7.1 Tipos aceitos

Aceitar somente:

- `application/pdf`
- `image/png`
- `image/jpeg`

Arquivos fora dessa lista devem ser rejeitados com mensagem clara.

### 7.2 Tamanho do arquivo

O sistema deve impor um limite configurável de tamanho por arquivo. O valor inicial exato será definido na implementação, mas a validação deve existir desde o primeiro commit funcional.

### 7.3 Confiança

O primeiro slice não precisa de um modelo sofisticado de scoring. Um indicador simples é suficiente, desde que permita:

- sinalizar sucesso com leitura considerada aceitável;
- sinalizar baixa confiança quando o OCR retornar pouco texto, texto vazio ou metadados insuficientes.

### 7.4 Interface

A interface deve ser simples e funcional, sem depender de dashboard completo. O objetivo é:

- permitir envio rápido do documento;
- tornar o estado do processamento visível;
- oferecer uma área clara de conferência do texto retornado.

## 8. Tratamento de erros

O sistema deve tratar explicitamente:

- tipo de arquivo inválido;
- arquivo vazio;
- arquivo acima do limite;
- falha de comunicação com a Azure;
- timeout de processamento;
- resposta sem texto utilizável;
- erro interno inesperado.

### 8.1 Resposta para o usuário

Mensagens devem ser claras e acionáveis. Exemplos esperados:

- reenviar em formato suportado;
- tentar novamente mais tarde;
- revisar qualidade do documento enviado.

Quando houver baixa confiança, o sistema deve mostrar o texto extraído junto com o aviso, em vez de mascarar o problema como sucesso pleno.

## 9. Estratégia de testes

Este subsistema será implementado com TDD e precisa nascer com testes cobrindo o comportamento principal.

### 9.1 Testes unitários

Cobrir:

- validação de tipo e tamanho de arquivo;
- normalização da resposta do Azure;
- cálculo do indicador de confiança;
- mapeamento de erros do domínio.

### 9.2 Testes de integração

Cobrir:

- rota de upload/processamento recebendo arquivo válido;
- rejeição de arquivo inválido;
- retorno de erro quando o OCR falhar;
- retorno de baixa confiança quando o OCR não gerar texto suficiente.

### 9.3 Testes de interface

Cobrir:

- envio de arquivo pela interface;
- exibição de estado de carregamento;
- renderização da conferência em caso de sucesso;
- exibição de mensagem de erro;
- exibição de aviso de baixa confiança.

### 9.4 Isolamento de dependência externa

O adapter da Azure deve ser injetável ou mockável por interface, para que testes automatizados não dependam da API real em toda execução.

## 10. Critérios de aceite

O slice será considerado concluído quando:

- aceitar upload de `PDF`, `PNG` e `JPG`;
- rejeitar formatos inválidos com mensagem clara;
- enviar o documento para `Azure AI Document Intelligence`;
- extrair e exibir o texto em uma tela de conferência;
- diferenciar estados de `idle`, `uploading`, `processing`, `success` e `error`;
- sinalizar baixa confiança de forma visível;
- manter a lógica de OCR desacoplada da interface;
- possuir testes cobrindo fluxo feliz e principais falhas.

## 11. Estrutura inicial sugerida

Uma estrutura inicial recomendada para o projeto:

- `app/` para interface e rotas do `Next.js`;
- `src/features/document-review/` para o caso de uso e contratos;
- `src/lib/ocr/` para o adapter do Azure;
- `src/lib/files/` para validações de arquivo;
- `src/lib/confidence/` para regra de sinalização;
- `tests/` ou co-location conforme a convenção escolhida na implementação.

Os nomes exatos podem ser refinados no plano, desde que a separação entre UI, rota, domínio e adapter seja preservada.

## 12. Riscos conhecidos

- variação de qualidade entre documentos reais;
- latência do OCR em arquivos grandes;
- dificuldade de definir confiança útil apenas com heurísticas simples;
- diferenças de comportamento entre PDF digital e imagem escaneada;
- necessidade futura de extrair a lógica para backend dedicado.

## 13. Resultado esperado deste ciclo

Ao final deste primeiro ciclo, o projeto deve ter uma base funcional que prove o fluxo:

`documento enviado -> OCR executado -> texto exibido para conferência`

Esse resultado deve servir como fundação para os próximos ciclos do MVP, especialmente:

- segmentação de exigências;
- tradução para linguagem clara;
- checklist;
- minuta inicial de resposta.
