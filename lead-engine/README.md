# Axante Proposal Preview Workflow

Sistema per creare ogni giorno proposte personalizzate con una pagina web dedicata per ciascuna azienda.

## Flusso previsto

1. ChatGPT individua e qualifica le aziende.
2. Analizza sito, offerta e presenza digitale.
3. Genera una preview personalizzata.
4. Pubblica la preview su Vercel.
5. Prepara il messaggio commerciale.
6. Salva un batch strutturato per Google Sheets.
7. Un evento GitHub avvia n8n soltanto quando il batch è completo.

## Componenti

- ChatGPT Project: ricerca, audit, contenuti, sito e controllo qualità.
- GitHub: codice, versionamento e batch giornalieri.
- Vercel: pubblicazione delle preview.
- Google Sheets: archivio operativo.
- n8n: sincronizzazione, invio e aggiornamento degli stati.

## URL finali

Struttura consigliata:

- `nomeazienda.demo.tuodominio.it`
- wildcard DNS: `*.demo.tuodominio.it`
- un solo progetto Vercel

Prima del collegamento del dominio si possono usare URL provvisori sotto il dominio Vercel.

## Sicurezza operativa

Un record può passare alla coda di invio soltanto se:

- la preview è online;
- il controllo qualità è superato;
- l'indirizzo è stato verificato;
- il messaggio contiene riferimenti specifici all'azienda;
- il campo `approved_for_contact` è impostato su `TRUE`;
- sono presenti le informazioni richieste per opposizione e gestione del contatto.

Il branch `lead-preview-engine` è separato dal sito pubblico Axante e può essere sviluppato senza modificare la produzione.
