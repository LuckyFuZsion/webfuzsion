// Common American to British English spelling conversions
const americanToBritishMap: Record<string, string> = {
  analyze: "analyse",
  analyzed: "analysed",
  analyzing: "analysing",
  analyzer: "analyser",
  center: "centre",
  centered: "centred",
  centering: "centring",
  color: "colour",
  colored: "coloured",
  coloring: "colouring",
  defense: "defence",
  favor: "favour",
  favorite: "favourite",
  favoring: "favouring",
  flavor: "flavour",
  flavored: "flavoured",
  flavoring: "flavouring",
  honor: "honour",
  honored: "honoured",
  honoring: "honouring",
  humor: "humour",
  humored: "humoured",
  humoring: "humouring",
  labor: "labour",
  labored: "laboured",
  laboring: "labouring",
  optimize: "optimise",
  optimized: "optimised",
  optimizing: "optimising",
  organization: "organisation",
  organize: "organise",
  organized: "organised",
  organizing: "organising",
  recognize: "recognise",
  recognized: "recognised",
  recognizing: "recognising",
  specialize: "specialise",
  specialized: "specialised",
  specializing: "specialising",
  standardize: "standardise",
  standardized: "standardised",
  standardizing: "standardising",
  theater: "theatre",
  traveled: "travelled",
  traveling: "travelling",
  traveler: "traveller",
  catalog: "catalogue",
  dialog: "dialogue",
  program: "programme",
  realize: "realise",
  realized: "realised",
  realizing: "realising",
  customize: "customise",
  customized: "customised",
  customizing: "customising",
  practice: "practise", // When used as a verb
  license: "licence", // When used as a noun
  gray: "grey",
  check: "cheque", // When referring to the payment method
  enrollment: "enrolment",
  fulfill: "fulfil",
  fulfillment: "fulfilment",
  skillful: "skilful",
  willful: "wilful",
  instill: "instil",
  distill: "distil",
  jewelry: "jewellery",
  plow: "plough",
  maneuver: "manoeuvre",
  maneuvered: "manoeuvred",
  maneuvering: "manoeuvring",
  mustache: "moustache",
  pajamas: "pyjamas",
  pediatric: "paediatric",
  pediatrician: "paediatrician",
  estrogen: "oestrogen",
  leukemia: "leukaemia",
  anemia: "anaemia",
  fetus: "foetus",
  archeology: "archaeology",
  medieval: "mediaeval",
  aging: "ageing",
  judgment: "judgement",
  acknowledgment: "acknowledgement",
  encyclopedia: "encyclopaedia",
  artifact: "artefact",
  tire: "tyre", // When referring to a wheel covering
  curb: "kerb", // When referring to the edge of a sidewalk
  draft: "draught", // In some contexts
  plow: "plough",
  skeptic: "sceptic",
  skeptical: "sceptical",
  skepticism: "scepticism",
}

// Function to convert American English to British English
export function convertToBritishEnglish(text: string): string {
  if (!text) return text

  let britishText = text

  // Replace whole words only (with word boundaries)
  Object.entries(americanToBritishMap).forEach(([american, british]) => {
    const regex = new RegExp(`\\b${american}\\b`, "gi")
    britishText = britishText.replace(regex, british)
  })

  return britishText
}

// Function to check if text contains American English spellings
export function containsAmericanEnglish(text: string): string[] {
  if (!text) return []

  const foundAmericanWords: string[] = []

  Object.keys(americanToBritishMap).forEach((american) => {
    const regex = new RegExp(`\\b${american}\\b`, "gi")
    if (regex.test(text)) {
      foundAmericanWords.push(american)
    }
  })

  return foundAmericanWords
}
