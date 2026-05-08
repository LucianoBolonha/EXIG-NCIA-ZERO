# Project History - Exigencia Zero

## 1. Objetivo deste Documento

Este arquivo registra o historico do trabalho realizado ate aqui no projeto `Exigencia Zero`, para permitir retomada futura sem perda de contexto.

## 2. Estado Atual do Projeto

O projeto foi estruturado e alinhado em tres frentes principais:

- narrativa estrategica do produto;
- definicao funcional do MVP;
- direcionamento tecnico inicial.

Neste momento, a documentacao central do projeto esta coerente e pronta para servir como base da proxima fase de decisao e implementacao.

## 3. Documentos Revisados e Ajustados

### 3.1 Pitch

Foi revisado o documento de pitch para alinhar a proposta do produto com uma narrativa mais crivel, consistente e adequada ao momento do projeto.

#### Ajustes realizados

- remocao de promessas absolutas;
- substituicao de metricas nao validadas por metas validaveis;
- reforco de que o produto apoia o profissional e nao o substitui;
- foco em notas devolutivas de registro de imoveis;
- inclusao de riscos como LGPD, variacao entre cartorios e necessidade de revisao humana.

#### Arquivos impactados

- `PITCH.md`
- `docs/PITCH.md`

### 3.2 PRD

O `PRD.md` foi revisado para ficar em conformidade com o pitch revisado.

#### Ajustes realizados

- foco do MVP restrito a cartorios de registro de imoveis no Brasil;
- definicao de funcionalidades de MVP;
- definicao do que fica fora do escopo inicial;
- delimitacao de usuarios-alvo prioritarios e secundarios;
- inclusao de requisitos funcionais e nao funcionais;
- inclusao de riscos, premissas, metricas e roadmap compativeis com a fase atual.

#### Arquivo impactado

- `PRD.md`

### 3.3 RFC

O `RFC.md` foi reescrito para alinhar a arquitetura tecnica ao estagio real do projeto.

#### Ajustes realizados

- remocao de arquitetura enterprise prematura;
- simplificacao para um MVP tecnico viavel;
- foco em backend, OCR, LLM, historico, seguranca e feedback;
- reforco da revisao humana obrigatoria;
- separacao entre decisoes para agora e decisoes a postergar.

#### Arquivo impactado

- `RFC.md`

## 4. Documentos Criados

### 4.1 DECISIONS.md

Criado para registrar decisoes tomadas e o momento oportuno das proximas definicoes.

### 4.2 BACKLOG.md

Criado para transformar o PRD em backlog inicial do MVP com prioridades, dependencias e sequencia recomendada.

### 4.3 PROJECT_HISTORY.md

Este documento foi criado para registrar a linha do tempo e permitir retomada futura.

## 5. Decisoes Ja Tomadas

### D-001 Nome da Marca

- a marca `Exigencia Zero` sera mantida.

### D-002 Direcao Estrategica

- a tese do produto permanece como tentativa de zerar exigencias cartorarias por meio de apoio operacional com IA.

### D-003 Metrica Principal do MVP

- a metrica principal do MVP sera o `percentual de analises aproveitadas sem retrabalho extenso`.

## 6. Decisoes Ainda Pendentes

### D-004 Stack Inicial de OCR

- ainda nao definida;
- foi feita recomendacao tecnica para comecar avaliando `Azure AI Document Intelligence Read`.

### D-005 Tecnologia de Frontend

- ainda nao definida.

### D-006 Formato de Exportacao

- ainda nao definido.

### D-007 Profundidade do Historico e Base de Conhecimento

- ainda nao definida.

## 7. Recomendacao Tecnica de OCR Registrada

Foi feita uma analise objetiva de opcoes de OCR para o MVP.

### Ordem recomendada

1. `Azure AI Document Intelligence Read`
2. `AWS Textract`
3. `Tesseract` como fallback, baseline local ou comparativo de custo
4. `Google Cloud Vision` apenas se houver motivo forte de ecossistema

### Justificativa resumida

- `Azure` foi recomendado como melhor ponto de partida por ser forte em OCR documental, lidar bem com PDF e imagens e se adequar ao contexto do MVP.

## 8. Checklist de Alinhamento Ja Validado

Os seguintes pontos ja foram revisados e considerados alinhados entre `PITCH`, `PRD` e `RFC`:

- posicionamento do produto;
- problema central;
- escopo do MVP;
- itens fora do escopo;
- usuario-alvo;
- promessa comercial mais responsavel;
- revisao humana obrigatoria;
- LGPD e seguranca;
- arquitetura tecnica do MVP;
- roadmap de evolucao gradual.

## 9. Ponto Exato de Pausa

O projeto foi pausado apos:

- revisao e alinhamento de `PITCH.md`, `PRD.md` e `RFC.md`;
- criacao de `DECISIONS.md` e `BACKLOG.md`;
- definicao da metrica principal do MVP;
- recomendacao inicial de OCR para futura decisao.

Nenhuma implementacao de codigo do produto foi iniciada ainda. O projeto esta pausado em fase de definicoes estrategicas e preparacao para execucao.

## 10. Proximo Passo Quando Retomar

Ao retornar, a ordem recomendada e:

1. decidir a stack inicial de `OCR`;
2. decidir a tecnologia de `frontend`;
3. revisar `DECISIONS.md` para atualizar novas definicoes;
4. transformar `BACKLOG.md` em plano de execucao por sprint;
5. iniciar implementacao tecnica do MVP.

## 11. Arquivos Atuais Relevantes

- `PITCH.md`
- `docs/PITCH.md`
- `PRD.md`
- `RFC.md`
- `DECISIONS.md`
- `BACKLOG.md`
- `PROJECT_HISTORY.md`

## 12. Resumo de Retomada Rapida

Se o projeto for retomado no futuro, o contexto essencial e:

- o produto e um SaaS com IA para apoiar analise de notas devolutivas de registro de imoveis;
- o MVP nao substitui o profissional e exige revisao humana;
- a metrica principal sera `percentual de analises aproveitadas sem retrabalho extenso`;
- a principal decisao tecnica pendente e a stack de OCR;
- a documentacao do projeto ja esta coerente e pronta para virar execucao.
