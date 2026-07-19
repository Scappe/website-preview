# Collegamento dominio Aruba → Vercel

Questa operazione può essere eseguita in seguito senza modificare il workflow o i siti generati.

## Struttura consigliata

Se il dominio principale è `azienda.it`, usa:

- `demo.azienda.it` come base;
- `*.demo.azienda.it` per le preview individuali;
- esempio: `centro-roma-x7k2.demo.azienda.it`.

Il dominio principale e il sito attuale non vengono spostati.

## Procedura

1. Apri il progetto Vercel dedicato alle preview.
2. Vai in Settings → Domains.
3. Aggiungi `demo.azienda.it`.
4. Aggiungi `*.demo.azienda.it`.
5. Vercel mostrerà i record DNS richiesti per quel progetto.
6. Apri Aruba → gestione dominio → DNS e Name Server → gestione DNS.
7. Inserisci esattamente i record CNAME e gli eventuali record TXT indicati da Vercel.
8. Non modificare i record del dominio principale, della posta o del sito esistente.
9. Torna su Vercel e attendi lo stato Valid Configuration e l'attivazione SSL.
10. Verifica almeno due sottodomini di prova.

## Regola importante

Non usare dieci record DNS distinti. La wildcard `*.demo.azienda.it` permette a un solo progetto Vercel di gestire tutte le preview presenti e future.

## Dati necessari il giorno del collegamento

- dominio esatto acquistato su Aruba;
- accesso alla gestione DNS;
- progetto Vercel definitivo;
- conferma che `demo` non sia già usato;
- scelta dell'URL finale, ad esempio `slug.demo.azienda.it`.

## Piano provvisorio

Fino al collegamento del dominio, il sistema usa:

`https://DOMINIO-VERCEL/p/slug-lead`

Dopo il collegamento, lo stesso record viene esposto anche come:

`https://slug-lead.demo.azienda.it`
