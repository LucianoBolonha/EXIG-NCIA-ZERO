# Decisions - Exigencia Zero

## 1. Objetivo

Este documento registra as decisoes ja tomadas no projeto e sinaliza o momento oportuno para as proximas definicoes relevantes.

## 2. Decisoes Ja Tomadas

### D-001 Nome da Marca

- **Decisao:** a marca do produto permanecera `Exigencia Zero`.
- **Status:** definida.
- **Observacao:** a comunicacao institucional e comercial deve ser forte, mas responsavel, evitando promessas absolutas de deferimento em qualquer cenario.

### D-002 Direcao Estrategica da Proposta

- **Decisao:** a tese central do produto e zerar as exigencias cartorarias por meio de apoio operacional com IA.
- **Status:** definida.
- **Observacao:** operacionalmente, o produto deve continuar sendo descrito como apoio ao profissional, com revisao humana obrigatoria.

### D-003 Mettrica Principal do MVP

- **Decisao:** a metrica principal do MVP sera o `percentual de analises aproveitadas sem retrabalho extenso`.
- **Status:** definida.
- **Observacao:** essa metrica deve orientar validacao de produto, priorizacao de melhorias e desenho dos fluxos de revisao.

## 3. Decisoes Pendentes

### D-004 Stack Inicial de OCR

- **Decisao a tomar:** qual tecnologia ou combinacao de tecnologias sera usada na primeira versao de OCR.
- **Momento oportuno:** antes do inicio da implementacao do pipeline de documentos.
- **Gatilho:** abertura do sprint tecnico de backend e processamento documental.
- **Impacto:** influencia qualidade da extracao, custo operacional e desenho do fluxo de confianca.

### D-005 Tecnologia de Frontend

- **Decisao a tomar:** qual stack sera usada para a interface web do MVP.
- **Momento oportuno:** antes do inicio do sprint de interface e experiencia do usuario.
- **Gatilho:** definicao das primeiras telas funcionais do produto.
- **Impacto:** influencia velocidade de desenvolvimento, consistencia da UX e manutencao.

### D-006 Formato de Exportacao

- **Decisao a tomar:** em quais formatos o usuario podera exportar o resultado revisado.
- **Momento oportuno:** antes do fechamento da jornada final de uso do MVP.
- **Gatilho:** detalhamento do fluxo de revisao, ajuste e exportacao.
- **Impacto:** influencia experiencia do usuario, implementacao e utilidade pratica do produto.

### D-007 Profundidade do Historico e Base de Conhecimento

- **Decisao a tomar:** se o historico no MVP servira apenas para consulta ou tambem para reaproveitamento inteligente.
- **Momento oportuno:** apos os primeiros testes com usuarios reais.
- **Gatilho:** existencia de massa minima de casos e feedback suficiente para avaliar padroes de uso.
- **Impacto:** influencia arquitetura de dados, estrategia de IA e priorizacao de evolucao.

## 4. Ordem Recomendada das Proximas Definicoes

1. definir `OCR` antes do build do pipeline documental;
2. definir `frontend` antes da implementacao das telas;
3. definir `exportacao` antes do fechamento do fluxo final do usuario;
4. definir `historico inteligente` apos o beta inicial.

## 5. Relacao com os Documentos do Projeto

- `PITCH.md`: orienta a narrativa, posicionamento e proposta de valor.
- `PRD.md`: orienta escopo, funcionalidades e metrica principal.
- `RFC.md`: orienta a implementacao tecnica e o momento de postergar complexidade.

Este documento deve ser atualizado sempre que uma nova decisao de produto ou tecnica for formalmente tomada.
