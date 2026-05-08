# RFC - Exigencia Zero

## 1. Objetivo deste RFC

Este documento descreve como o MVP do Exigencia Zero deve ser construído do ponto de vista técnico, em alinhamento com o `PITCH` e o `PRD`.

O foco deste RFC é definir uma arquitetura viável, segura e evolutiva para a primeira versão do produto, sem antecipar complexidade desnecessária.

## 2. Princípios Técnicos

O MVP deve seguir os seguintes princípios:

- simplicidade arquitetural antes de otimização prematura;
- foco exclusivo em notas devolutivas de cartórios de registro de imóveis no Brasil;
- revisão humana obrigatória antes do uso externo do conteúdo gerado;
- rastreabilidade das análises e das saídas geradas;
- segurança e conformidade com LGPD desde o início;
- evolução incremental baseada em uso real e feedback dos usuários.

## 3. Escopo Técnico do MVP

O RFC cobre apenas a primeira versão operacional do produto.

### Incluído

- upload de documentos em PDF, JPG e PNG;
- extração de texto com OCR;
- conferência do texto extraído pelo usuário;
- segmentação das exigências identificadas;
- tradução da linguagem técnica para linguagem clara;
- geração de checklist de providências;
- sugestão de minuta inicial de resposta;
- armazenamento do histórico de análises;
- coleta de feedback do usuário;
- controles básicos de segurança, auditoria e retenção.

### Não incluído nesta fase

- protocolização automática em cartórios;
- integração nativa com CRMs, ERPs ou sistemas jurídicos;
- expansão para outras especialidades cartorárias;
- operação internacional;
- fine-tuning próprio obrigatório no MVP;
- arquitetura multi-região e requisitos enterprise avançados.

## 4. Arquitetura Proposta

### 4.1 Visão Geral

A arquitetura inicial deve ser simples, modular e preparada para evolução gradual.

### 4.2 Componentes Principais

#### Backend de Aplicação

- `FastAPI` em Python para APIs, orquestração do fluxo e regras de negócio.

#### Interface do Usuário

- aplicação web com fluxo de upload, revisão, análise e feedback.
- a tecnologia exata do frontend pode ser definida pelo time, desde que priorize simplicidade, clareza e manutenção.

#### Banco de Dados

- `PostgreSQL` para usuários, metadados, histórico de análises, feedbacks e trilhas de auditoria.

#### Armazenamento de Arquivos

- `S3` ou serviço compatível para guardar documentos enviados e artefatos processados.

#### OCR

- mecanismo principal de OCR com suporte a documentos em PDF e imagem.
- estratégia de fallback pode ser adotada, mas não deve ser obrigatória na primeira entrega se aumentar demais a complexidade.

#### LLM

- um modelo principal de linguagem para interpretação das exigências e geração de saída assistida.
- fallback entre modelos pode ser tratado como evolução futura, salvo necessidade operacional comprovada.

#### Processamento Assíncrono

- fila simples de tarefas apenas se o tempo de processamento tornar a experiência síncrona inviável.
- evitar introduzir orquestradores pesados no MVP sem necessidade concreta.

## 5. Fluxo Técnico de Processamento

O fluxo do MVP deve seguir a lógica abaixo:

1. o usuário envia a nota devolutiva;
2. o sistema valida tipo e integridade do arquivo;
3. o sistema executa OCR;
4. o sistema calcula sinal de confiança da extração;
5. o texto extraído é exibido para conferência;
6. o sistema segmenta e organiza as exigências;
7. o sistema gera explicação em linguagem clara;
8. o sistema gera checklist de providências;
9. o sistema sugere uma minuta inicial de resposta;
10. o sistema apresenta avisos de revisão humana e nível de confiança;
11. o usuário revisa e ajusta o conteúdo;
12. o sistema salva histórico e feedback.

## 6. Estratégia de OCR

O OCR é uma dependência crítica do produto e deve ser tratado com monitoramento desde o início.

### Diretrizes

- suportar PDFs digitalizados e imagens comuns de documentos;
- aplicar pré-processamento quando necessário para melhorar legibilidade;
- registrar score de confiança por documento ou trecho;
- permitir sinalização de baixa qualidade para revisão manual;
- armazenar texto extraído para inspeção e melhoria futura.

### Observação

O RFC anterior definia combinações específicas e definitivas de OCR. Para o MVP, o mais importante é garantir confiabilidade operacional mínima, e não prender o time cedo demais a uma arquitetura complexa de múltiplos provedores.

## 7. Estratégia de IA e Geração

O uso de IA deve ser orientado por apoio operacional, não por automação cega.

### Objetivos do modelo

- identificar blocos de exigência no texto;
- resumir cada exigência em linguagem mais clara;
- indicar o que deve ser corrigido, anexado ou verificado;
- sugerir uma estrutura inicial de resposta.

### Restrições importantes

- a saída não deve ser apresentada como parecer jurídico conclusivo;
- o sistema deve evitar linguagem de certeza quando houver ambiguidade;
- respostas precisam ser acompanhadas de aviso de revisão humana;
- o sistema deve registrar feedback para melhoria contínua.

### Sobre fine-tuning

Fine-tuning, base vetorial e busca por casos similares podem ser úteis no futuro, mas não devem ser pré-requisitos do MVP. Antes disso, o time deve validar:

- qualidade do OCR;
- utilidade real da saída gerada;
- padrões recorrentes de exigência;
- volume e qualidade dos dados disponíveis para treinamento seguro.

## 8. Segurança, Privacidade e LGPD

Como o produto lida com documentação potencialmente sensível, estes requisitos são mandatórios no MVP:

- autenticação de usuários;
- autorização por conta e escopo de acesso;
- criptografia em trânsito;
- proteção de documentos armazenados;
- trilha de auditoria básica de uploads, análises e exportações;
- política de retenção e descarte;
- possibilidade de exclusão de dados quando aplicável;
- cuidado com anonimização de casos usados para melhoria do sistema.

### Observação

Certificações como `SOC 2 Type II` e `ISO 27001` podem ser metas futuras, mas não devem ser tratadas como exigência imediata desta fase.

## 9. Confiabilidade e Gestão de Risco

O sistema precisa operar com transparência sobre suas limitações.

### Medidas mínimas

- sinalizar baixa confiança do OCR;
- sinalizar baixa confiança da interpretação quando aplicável;
- bloquear ou alertar quando o documento estiver ilegível;
- destacar que a minuta é uma sugestão revisável;
- permitir correção e feedback pelo usuário;
- manter logs suficientes para investigação de falhas.

## 10. Observabilidade

No MVP, a observabilidade deve ser suficiente para operação e aprendizado, sem empilhar ferramentas desnecessárias.

### Indicadores recomendados

- tempo médio de processamento por documento;
- taxa de falha no OCR;
- taxa de documentos com baixa confiança;
- frequência de edição manual da saída sugerida;
- taxa de feedback positivo ou negativo;
- número de reprocessamentos por documento.

## 11. Decisões de Arquitetura

### Decisões recomendadas agora

- usar backend em Python com `FastAPI`;
- usar `PostgreSQL` como base principal;
- usar armazenamento de objetos para documentos;
- manter arquitetura modular para troca futura de OCR e LLM;
- adotar processamento síncrono inicialmente, migrando para fila assíncrona se necessário.

### Decisões a postergar

- banco vetorial dedicado;
- pipeline avançado com orquestradores complexos;
- múltiplos modelos com fallback sofisticado;
- fine-tuning contínuo;
- multi-cloud ou multi-região;
- infraestrutura enterprise avançada.

## 12. Riscos Técnicos

- baixa qualidade dos documentos enviados;
- variabilidade da linguagem entre cartórios;
- respostas excessivamente confiantes em casos ambíguos;
- custo variável de OCR e LLM;
- exposição indevida de dados sensíveis se os controles forem insuficientes.

## 13. Evolução Recomendada

Após validação do MVP, a arquitetura pode evoluir para:

- busca em histórico de casos semelhantes;
- templates customizáveis por tipo de exigência;
- regras de negócio mais sofisticadas por categoria registral;
- fila assíncrona para maior volume;
- camada de métricas operacionais mais robusta;
- integrações com sistemas externos;
- expansão para novas frentes documentais, se o core estiver validado.

## 14. Conclusão

O RFC do Exigencia Zero deve refletir a fase real do projeto: um produto de apoio operacional com IA, especializado em notas devolutivas de registro de imóveis, construído de forma gradual, segura e validável.

O objetivo técnico neste momento não é maximizar sofisticação arquitetural, e sim entregar uma base confiável que permita aprender com usuários reais, reduzir retrabalho e evoluir o produto com coerência em relação ao `PITCH` e ao `PRD`.
