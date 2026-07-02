#!/usr/bin/env node

/**
 * i18n Dry Run Script
 *
 * Fetches current CMS blocks for all pages, adds _i18n translations
 * to every translatable field, and writes patched content to dry-run/.
 *
 * Usage: node scripts/i18n-dry-run.mjs
 *
 * Review the output in dry-run/ before patching the CMS.
 */

import { writeFileSync, mkdirSync } from 'fs'

const API_BASE = 'https://v3.jaalyantra.com/web'
const DOMAIN = 'jaalyantra.com'
const PAGES = ['company', 'about-us', 'home']
const LOCALES = ['it-IT', 'lv-LV']

// ─── Translation data ────────────────────────────────────────────────
// Each entry maps a block ID to the _i18n fields to merge into content.
// For nested structures (arrays of fields), we patch in-place.

const TRANSLATIONS = {
  company: {
    '01KWEV16F6MN8029NT0G1QZ058': {
      // Header block
      title_i18n: {
        'it-IT': 'Azienda e Conformità',
        'lv-LV': 'Uzņēmums un atbilstība',
      },
      subtitle_i18n: {
        'it-IT':
          'Dettagli di registrazione normativa e fiscale per le entità JYT nelle varie giurisdizioni. Usa il pulsante copia per prendere qualsiasi valore per le dichiarazioni di conformità.',
        'lv-LV':
          'Regulatīvo un nodokļu reģistrācijas dati JYT struktūrvienībām dažādās jurisdikcijās. Izmantojiet kopēšanas pogu, lai iegūtu jebkuru vērtību atbilstības iesniegumiem.',
      },
    },
    '01KWEV16FF5WSTVA2GQC4872JM': {
      // CompanyData block — region labels
      regions_i18n: {
        'it-IT': {
          india: { label: 'India' },
          eu: { label: 'Unione Europea (Lettonia)' },
        },
        'lv-LV': {
          india: { label: 'Indija' },
          eu: { label: 'Eiropas Savienība (Latvija)' },
        },
      },
      // Section headings (shared across regions)
      sections_i18n: {
        'it-IT': {
          tax: { heading: 'Informazioni Fiscali' },
          filing: { heading: 'Dichiarazioni e Conformità' },
          registration: { heading: 'Dettagli di Registrazione' },
        },
        'lv-LV': {
          tax: { heading: 'Nodokļu Informācija' },
          filing: { heading: 'Iesniegumi un Atbilstība' },
          registration: { heading: 'Reģistrācijas Detaļas' },
        },
      },
      // Field labels — keyed by region.fieldKey
      fields_i18n: {
        'it-IT': {
          // India tax
          gst: { label: 'Partita IVA (GSTIN)' },
          pan: { label: 'PAN' },
          tan: { label: 'TAN' },
          msme: { label: 'Registrazione MSME' },
          // India filing
          financialYear: { label: 'Anno Finanziario Corrente' },
          lastAnnualReturn: { label: 'Ultima Dichiarazione Annuale' },
          nextGstReturn: { label: 'Scadenza Dichiarazioni GST' },
          auditor: { label: 'Revisore dei Conti' },
          // India registration
          companyName: { label: "Nome dell'Azienda" },
          cin: { label: 'CIN' },
          incorporationDate: { label: 'Data di Costituzione' },
          registeredAddress: { label: 'Sede Legale' },
          status: { label: 'Stato' },
          // EU tax
          vatNumber: { label: 'Registrazione IVA' },
          euTaxId: { label: 'Codice Fiscale UE' },
          taxAuthority: { label: 'Autorità Fiscale' },
          // EU filing
          nextVatReturn: { label: 'Scadenza Dichiarazioni IVA' },
          // EU registration
          registrationNumber: { label: 'Numero di Registrazione' },
          legalForm: { label: 'Forma Giuridica' },
        },
        'lv-LV': {
          // India tax
          gst: { label: 'GSTIN' },
          pan: { label: 'PAN' },
          tan: { label: 'TAN' },
          msme: { label: 'MSME Reģistrācija' },
          tan: { label: 'TAN' },
          msme: { label: 'MSME Reģistrācija' },
          // India filing
          financialYear: { label: 'Pašreizējais Finanšu Gads' },
          lastAnnualReturn: { label: 'Pēdējais Gada Pārskats' },
          nextGstReturn: { label: 'GST Deklarāciju Termiņš' },
          auditor: { label: 'Statutārais Auditors' },
          // India registration
          companyName: { label: 'Uzņēmuma Nosaukums' },
          cin: { label: 'CIN' },
          incorporationDate: { label: 'Reģistrācijas Datums' },
          registeredAddress: { label: 'Reģistrētā Adrese' },
          status: { label: 'Statuss' },
          // EU tax
          vatNumber: { label: 'PVN Reģistrācija' },
          euTaxId: { label: 'ES Nodokļu ID' },
          taxAuthority: { label: 'Nodokļu Administrācija' },
          // EU filing
          nextVatReturn: { label: 'PVN Deklarāciju Termiņš' },
          // EU registration
          registrationNumber: { label: 'Reģistrācijas Numurs' },
          legalForm: { label: 'Juridiskā Forma' },
        },
      },
    },
  },

  'about-us': {
    '01JY1QEZ8TXR0TX5WGJ086P5C5': {
      // Header block
      title_i18n: {
        'it-IT': 'Tessere il Futuro dei Tessuti, Insieme.',
        'lv-LV': 'Audiot nākotnes tekstilmateriālus, kopā.',
      },
      subtitle_i18n: {
        'it-IT':
          "Scopri l'Eredità, l'Innovazione e la Passione dietro Jaal Yantra Textiles.",
        'lv-LV':
          'Atklājiet mantojumu, inovācijas un kaislību aiz Jaal Yantra Textiles.',
      },
      mission_i18n: {
        'it-IT': {
          title: 'La Nostra Visione',
          paragraphs: [
            "In Jaal Yantra Textiles, la nostra missione è fondere armoniosamente l'artigianato tradizionale con l'innovazione all'avanguardia per produrre tessuti di qualità e bellezza senza pari. Ci impegniamo in pratiche sostenibili, approvvigionamento etico e nel promuovere un legame profondo con i nostri artigiani e clienti in tutto il mondo.",
            "Cerchiamo di essere più di un semplice fornitore; miriamo a essere un partner fidato, che potenzia designer e aziende con tessuti che ispirano creatività ed elevano le loro creazioni. La nostra dedizione all'eccellenza è intessuta in ogni filo.",
            "La nostra visione è essere leader globali nei tessuti sostenibili e innovativi, riconosciuti per il nostro impegno verso la qualità, le nostre persone e il pianeta. Immaginiamo un futuro in cui i tessuti arricchiscono le vite e contribuiscono positivamente all'ambiente.",
          ],
        },
        'lv-LV': {
          title: 'Mūsu Vīzija',
          paragraphs: [
            'Jaal Yantra Textiles mūsu misija ir harmoniski apvienot tradicionālo amatniecību ar jaunākajām inovācijām, lai radītu tekstilmateriālus bezprecedenta kvalitātes un skaistuma. Mēs esam apņēmušies izmantot ilgtspējīgas prakses, ētisku iepirkšanu un veicināt dzišu saikni ar mūsu amatniekiem un klientiem visā pasaulē.',
            'Mēs tiecamies būt vairāk nekā vienkārši piegādātājs; mēs vēlamies būt uzticams partneris, kas sniedz dizaineriem un uzņēmumiem audumus, kas iedvesmo kreativitāti un pacel viņu radīto jaunu līmenī. Mūsu veltība ekselencei ir ieausta katrā diegā.',
            'Mūsu vīzija ir būt globālam līderim ilgtspējīgos un inovatīvos tekstilmateriālos, atzītam par mūsu apņemību pret kvalitāti, mūsu cilvēkiem un planētu. Mēs redzam nākotni, kurā tekstilmateriāli bagātina dzīvi un pozitīvi ietekmē vidi.',
          ],
        },
      },
      stats_i18n: {
        'it-IT': [
          { label: 'Eredità Tessile Indiana' },
          { label: 'Mercati Globali Serviti' },
          { label: 'Artigiani Potenziate' },
          { label: 'Linee di Tessuti Sostenibili' },
        ],
        'lv-LV': [
          { label: 'Indijas Tekstilmateriālu Mantojums' },
          { label: 'Apkalpotie Globālie Tirgi' },
          { label: 'Pilnvarotie Amatnieki' },
          { label: 'Ilgtspējīgas Audumu Līnijas' },
        ],
      },
    },
    '01JY1QMZA9DKR8Y14Z1EHANAWX': {
      // Investors block
      heading_i18n: {
        'it-IT': 'I nostri partner di crescita',
        'lv-LV': 'Mūsu izaugsmes partneri',
      },
      subheading_i18n: {
        'it-IT': 'Persone che credono in noi',
        'lv-LV': 'Cilvēki, kas tic mums',
      },
      description_i18n: {
        'it-IT':
          "Jaal Yantra Textiles è orgogliosa di essere supportata da un gruppo distinto di investitori che condividono il nostro impegno per l'innovazione, la sostenibilità e l'eccellenza nell'industria tessile.",
        'lv-LV':
          'Jaal Yantra Textiles ir lepna saņemt atbalstu no izcilu investoru grupas, kuri dalās mūsu apņemībā pret inovācijām, ilgtspējību un ekselenci tekstilrūpniecībā.',
      },
    },
    '01JY1QPYE7XBMB2KJAVVRAM6DJ': {
      // Team block
      heading_i18n: {
        'it-IT': 'Incontra la Nostra Gente',
        'lv-LV': 'Iepazīstieties ar Mūsu Cilvēkiem',
      },
      subheading_i18n: {
        'it-IT': "Ci appoggiamo sull'esperienza del passato",
        'lv-LV': 'Mēs balstāmies uz pagātnes pieredzi',
      },
      description_i18n: {
        'it-IT':
          'La nostra vera forza risiede nel nostro team diversificato e talentuoso. Dai maestri tessitori che portano generazioni di conoscenza ai designer innovativi che spingono i confini creativi.',
        'lv-LV':
          'Mūsu patiesā stiprība slēpjas mūsu dažādajā un talantīgajā komandā. No meistaru audējiem, kuri nes paaudžu zināšanas, līdz inovatīviem dizaineriem, kas paplašina radošās robežas.',
      },
      story_i18n: {
        'it-IT': [
          'È questo spirito collettivo che definisce Jaal Yantra Textiles e guida il nostro successo. Ogni membro porta una prospettiva e un set di competenze unici.',
          "Promuoviamo una cultura di collaborazione e apprendimento continuo, assicurandoci di rimanere all'avanguardia dell'industria tessile pur onorando la nostra ricca eredità.",
        ],
        'lv-LV': [
          'Tieši šis kolektīvais gars definē Jaal Yantra Textiles un virza mūsu panākumus. Katrs locekļis sniedz unikālu perspektīvu un prasmju kopumu.',
          'Mēs veicinām sadarbības un nepārtrauktas mācīšanās kultūru, nodrošinot, ka paliksim tekstilrūpniecības avangardā, godājot mūsu bagātīgo mantojumu.',
        ],
      },
      ctaButton_i18n: {
        'it-IT': { text: 'Scopri la Nostra Cultura Aziendale' },
        'lv-LV': { text: 'Atklājiet Mūsu Uzņēmuma Kultūru' },
      },
    },
  },

  home: {
    '01JRTRYJGPHKFD0DV49APMT5Z7': {
      // Header Section
      announcement_i18n: {
        'it-IT': 'Siamo in fase alpha',
        'lv-LV': 'Mēs esam alpha fāzē',
      },
    },
    '01JRTRXDNT3NY2NJHDGTHV6MTG': {
      // Hero Section
      title_i18n: {
        'it-IT': 'Progetta, Approvvigiona e Vendi le Tue Collezioni Facilmente.',
        'lv-LV': 'Veidojiet, iegādājieties un pārdodiet savas kolekcijas vienkārši.',
      },
      subtitle_i18n: {
        'it-IT':
          'JYT potenzia i designer visionari per creare modelli unici, gestire partner artigiani e vendere direttamente ai clienti senza lasciare la piattaforma.',
        'lv-LV':
          'JYT sniedz iespēju vīzijas pilniem dizaineriem radīt unikātus modeļus, pārvaldīt amatnieku partnerus un pārdot tieši klientiem, neatstājot platformu.',
      },
    },
    '01JY1180NAZ5WFE7PXXAEZNWR9': {
      // Feature Section
      title_i18n: {
        'it-IT': 'Una Panoramica della Tua Pipeline di Design',
        'lv-LV': 'Pārskats par Jūsu Dizaina Cēlu',
      },
    },
    '01JY11JV11FRD9AEVBPHGSTP1S': {
      // BentoSection
      title_i18n: {
        'it-IT': 'Dal design al commercio',
        'lv-LV': 'No dizaina līdz tirdzniecībai',
      },
      subtitle_i18n: {
        'it-IT': 'Progetta, Produci e Celebra — è così semplice',
        'lv-LV': 'Veidojiet, Ražojiet un Sviniet — tik vienkārši',
      },
    },
    '01JY11ZB592BZDZ5K22C74EB4A': {
      // DarkBentoSection
      title_i18n: {
        'it-IT': 'Vendi Come Fai Già',
        'lv-LV': 'Pārdodiet Tā, Kā Jau Dariet',
      },
      subtitle_i18n: {
        'it-IT': 'Lo Stack di E-Commerce Integrato Che Funziona a Modo Tuo',
        'lv-LV': 'Integrētais E-Komercijas Staks, Kas Strādā Jūsu Veidā',
      },
    },
    '01JY126A7JXV6MDBMHMAFC1CK6': {
      // TestimonialsSection
      title_i18n: {
        'it-IT': 'Voci dalla piattaforma',
        'lv-LV': 'Balsi no platformas',
      },
    },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────

async function fetchPage(slug) {
  const url = `${API_BASE}/website/${DOMAIN}/${slug}`
  console.log(`  Fetching ${slug}...`)
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`  ✗ Failed to fetch ${slug}: ${res.status}`)
    return null
  }
  return res.json()
}

function applyTranslations(block, i18nPatch) {
  if (!i18nPatch) return block

  const patched = JSON.parse(JSON.stringify(block))
  const content = patched.content

  for (const [key, value] of Object.entries(i18nPatch)) {
    if (key.endsWith('_i18n')) {
      const baseKey = key.replace('_i18n', '')
      content[key] = value
    }
  }

  return patched
}

function applyCompanyDataTranslations(block, i18nPatch) {
  const patched = JSON.parse(JSON.stringify(block))
  const content = patched.content

  // Apply region labels
  if (i18nPatch.regions_i18n) {
    content.regions_i18n = i18nPatch.regions_i18n
  }

  // Apply section headings
  if (i18nPatch.sections_i18n) {
    content.sections_i18n = i18nPatch.sections_i18n
  }

  // Apply field labels
  if (i18nPatch.fields_i18n) {
    content.fields_i18n = i18nPatch.fields_i18n
  }

  return patched
}

function summarizeChanges(original, patched) {
  const changes = []
  const orig = JSON.stringify(original.content ?? {})
  const patch = JSON.stringify(patched.content ?? {})
  const addedKeys = []

  const patchObj = patched.content ?? {}
  for (const key of Object.keys(patchObj)) {
    if (key.endsWith('_i18n') && !(key in (original.content ?? {}))) {
      addedKeys.push(key)
    }
  }

  return {
    blockId: original.id,
    blockName: original.name,
    addedKeys,
    originalSize: orig.length,
    patchedSize: patch.length,
    sizeDelta: patch.length - orig.length,
  }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══ i18n Dry Run ═══\n')
  console.log(`API: ${API_BASE}`)
  console.log(`Domain: ${DOMAIN}`)
  console.log(`Pages: ${PAGES.join(', ')}`)
  console.log(`Locales: ${LOCALES.join(', ')}\n`)

  mkdirSync('dry-run', { recursive: true })

  const allChanges = []

  for (const slug of PAGES) {
    console.log(`\n── ${slug} ──`)
    const page = await fetchPage(slug)
    if (!page) continue

    const pageTranslations = TRANSLATIONS[slug] ?? {}
    const patchedBlocks = []

    for (const block of page.blocks ?? []) {
      const i18nPatch = pageTranslations[block.id]
      if (!i18nPatch) {
        console.log(`  ⚠ ${block.name} (${block.id}) — no translations defined`)
        patchedBlocks.push(block)
        continue
      }

      let patched
      if (slug === 'company' && block.name === 'CompanyData') {
        patched = applyCompanyDataTranslations(block, i18nPatch)
      } else {
        patched = applyTranslations(block, i18nPatch)
      }

      const summary = summarizeChanges(block, patched)
      console.log(
        `  ✓ ${block.name} (${block.id}) — added: ${summary.addedKeys.join(', ')}`
      )
      allChanges.push(summary)
      patchedBlocks.push(patched)
    }

    const patchedPage = { ...page, blocks: patchedBlocks }
    const outFile = `dry-run/${slug}.patched.json`
    writeFileSync(outFile, JSON.stringify(patchedPage, null, 2))
    console.log(`  → Written to ${outFile}`)
  }

  // Summary
  console.log('\n═══ Summary ═══\n')
  console.log('Block'.padEnd(30) + 'Added Keys'.padEnd(40) + 'Size Δ')
  console.log('─'.repeat(80))
  for (const c of allChanges) {
    console.log(
      `${c.blockName} (${c.blockId.slice(-8)})`.padEnd(30) +
        c.addedKeys.join(', ').padEnd(40) +
        `+${c.sizeDelta}`
    )
  }

  const totalAdded = allChanges.reduce((n, c) => n + c.addedKeys.length, 0)
  console.log('\n' + `Total blocks patched: ${allChanges.length}`)
  console.log(`Total _i18n keys added: ${totalAdded}`)
  console.log(`Locales: ${LOCALES.join(', ')}`)
  console.log('\n✓ Dry run complete. Review files in dry-run/ before patching CMS.\n')
}

main().catch((err) => {
  console.error('Dry run failed:', err)
  process.exit(1)
})
