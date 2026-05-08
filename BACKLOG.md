# Backlog Inicial - Exigencia Zero

## 1. Objetivo

Este backlog traduz o `PRD` em um conjunto inicial de entregas para o MVP, priorizadas pela capacidade de gerar validacao rapida com usuarios reais.

## 2. Prioridade P0

### BL-001 Upload de Documento

- permitir upload de `PDF`, `PNG` e `JPG`;
- validar tipo e integridade do arquivo;
- exibir estados de carregamento e erro.

### BL-002 OCR e Texto Extraido

- processar o documento enviado;
- extrair texto utilizavel;
- exibir o texto extraido para conferencia do usuario;
- sinalizar baixa confianca quando aplicavel.

### BL-003 Analise de Exigencias

- identificar blocos de exigencia no texto;
- separar exigencias por tema ou assunto;
- apresentar explicacao em linguagem clara.

### BL-004 Checklist de Providencias

- gerar lista objetiva do que precisa ser corrigido, anexado ou verificado;
- estruturar o checklist de forma facil de revisar.

### BL-005 Sugestao de Minuta

- gerar estrutura inicial de resposta ao cartorio;
- sinalizar de forma explicita que a saida precisa de revisao humana;
- permitir edicao pelo usuario.

### BL-006 Fluxo de Revisao

- permitir revisar texto extraido, checklist e minuta;
- permitir ajustes antes da finalizacao;
- organizar a experiencia em um fluxo simples e claro.

### BL-007 Historico Basico

- salvar analises anteriores;
- listar historico por usuario;
- permitir reabrir uma analise concluida.

### BL-008 Feedback do Usuario

- coletar avaliacao simples da utilidade da analise;
- registrar se houve retrabalho extenso;
- armazenar feedback para melhoria futura.

### BL-009 Seguranca Basica

- autenticar usuarios;
- restringir acesso aos documentos e analises do proprio usuario;
- manter trilha basica de auditoria.

## 3. Prioridade P1

### BL-010 Monitoramento Operacional

- medir tempo medio de processamento;
- medir taxa de falha de OCR;
- medir percentual de analises aproveitadas sem retrabalho extenso.

### BL-011 Confianca e Alertas

- definir regras de baixa confianca de OCR;
- definir avisos para resposta ambigua;
- exibir avisos claros ao usuario.

### BL-012 Retencao e LGPD

- definir politica de retencao de documentos;
- prever exclusao de dados quando aplicavel;
- registrar fundamentos basicos de tratamento de dados.

### BL-013 Dashboard Simples

- mostrar status das analises;
- listar historico recente;
- facilitar acesso a documentos processados.

## 4. Prioridade P2

### BL-014 Exportacao do Resultado

- exportar analise revisada em formato a definir;
- manter consistencia entre checklist e minuta exportados.

### BL-015 Templates de Resposta

- permitir variacoes de estrutura de minuta;
- adaptar sugestoes por tipo de exigencia recorrente.

### BL-016 Relatorios Operacionais

- consolidar dados de uso;
- acompanhar eficiencia e retrabalho por periodo.

### BL-017 Reaproveitamento de Casos

- estudar uso do historico para sugerir padroes;
- avaliar busca por casos semelhantes apos o beta.

## 5. Dependencias Criticas

- decisao da stack de `OCR`;
- decisao da tecnologia de `frontend`;
- definicao inicial de autenticacao;
- definicao do formato de exportacao antes do fechamento do fluxo final.

## 6. Sequencia Recomendada de Execucao

1. `Upload de Documento`
2. `OCR e Texto Extraido`
3. `Analise de Exigencias`
4. `Checklist de Providencias`
5. `Sugestao de Minuta`
6. `Fluxo de Revisao`
7. `Historico Basico`
8. `Feedback do Usuario`
9. `Seguranca Basica`
10. `Monitoramento Operacional`

## 7. Criterio de Sucesso do MVP

O MVP sera considerado bem encaminhado quando conseguir:

- processar notas devolutivas reais com estabilidade;
- gerar analises compreensiveis;
- permitir revisao humana com facilidade;
- medir o `percentual de analises aproveitadas sem retrabalho extenso`.
