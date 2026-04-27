export const getApaKataMereka = (locale = "id") => {
  const data = {
    id: [
      {
        name: "H. Nasaruddin Umar",
        position: "Menteri Agama Republik Indonesia",
        image: "/menteri.png",
        quote: [
          "Mari kita wakafkan diri kita untuk berhimpun kepada umat melalui Kementerian Agama.",
          "Kemenag tidak serta merta menjadikan kita kaya raya, namun dari sanlah kita dapat pelajaran yang penting berkah.",
        ],
      },
      {
        name: "H. Muhammad Yusi Abdhian, S.HI., M.HI.",
        position: "Kepala Kantor Wilayah Kemenag Provinsi Kalimantan Tengah",
        image: "/Kanwil.png",
        quote: [
          "Hijrah adalah kiscayahan untuk menuju kehidupan yang lebih baik, hijrah adalah suah pilar utak yang haris dilakukan untuk memperbaki kembla arak haluan kemnyimpang, Bahkan para Nabi dan Rasul pun berhijrah.",
          "Dari hijrah yang sesungguhnya adalah hijrah kepad Allah, melaksanakan perjalan menuju Allah, dengan ketaqatan hati yang engangkalan segala bentuk kehilangan dan kemungkaran.",
          "Di sertain keteguhan dalam menjalankan semu tuntunan anal kebijak, sebagai satu-satunya pilar untuk memperkuat langkah perjalan kita menuju ridha Allah SWT",
        ],
      },
      {
        name: "H. Arbaja, S.Ag., M.A.P",
        position: "Kepala Kantor Kemenag Kabupaten Barito Utara",
        image: "/Kemenag-kepala.png",
        quote: [
          "Ladang perbedaan sebagai ujian keimanan dalam berbangsa dan bernegara agar tetap indah dengan berbagai warna dan jenis.",
          "Jangankan menjadi sebab perbedaan sebagai kesomobongan akan rasa paling benar dalam berfikir dan bertindak, karena perbedaan yang mengikatkan perpecahanan yang membut bangsa dan negara melemah, hingga akhirnya mu dah terijah.",
          "Mari satukan ENERGI kita, tuangkan dalam KERJA nyata sebagai amal bhakti bagi nusa dan bangsa demi menjaga Marwah Kementerian Agama.",
        ],
      },
    ],
    en: [
      {
        name: "H. Nasaruddin Umar",
        position: "Minister of Religious Affairs of the Republic of Indonesia",
        image: "/menteri.png",
        quote: [
          "Let us dedicate ourselves to serving the community through the Ministry of Religious Affairs.",
          "The Ministry does not necessarily make us wealthy, but from there we gain the important lesson of blessings.",
        ],
      },
      {
        name: "H. Muhammad Yusi Abdhian, S.HI., M.HI.",
        position:
          "Head of the Regional Office of the Ministry of Religious Affairs, Central Kalimantan Province",
        image: "/Kanwil.png",
        quote: [
          "Migration (Hijrah) is a necessity towards a better life; it is a main pillar that must be undertaken to correct the direction of deviation. Even the Prophets and Messengers migrated.",
          "The true migration is towards Allah, undertaking a journey towards Allah, with obedience of heart that abandons all forms of loss and evil.",
          "Accompanied by steadfastness in following all wise guidance, as the only pillar to strengthen our steps towards the pleasure of Allah SWT.",
        ],
      },
      {
        name: "H. Arbaja, S.Ag., M.A.P",
        position:
          "Head of the Office of the Ministry of Religious Affairs, Barito Utara Regency",
        image: "/Kemenag-kepala.png",
        quote: [
          "The field of difference is a test of faith in nation and state-building, so it remains beautiful with various colors and types.",
          "Let difference not become a cause for arrogance or feeling most right in thinking and acting, because differences that lead to division make the nation and state weak, until finally easily colonized.",
          "Let us unite our ENERGY, pour it into real WORK as a service to the nation and country for the sake of maintaining the dignity of the Ministry of Religious Affairs.",
        ],
      },
    ],
  };

  return data[locale] || data.id;
};
