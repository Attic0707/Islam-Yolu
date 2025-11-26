import React, { useState, useMemo } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Modal, Share, ImageBackground, } from "react-native";
import ScaledText from "./ScaledText";

const STORY_PICS = [
  require("../assets/images/ilham_pics/ilham1.jpg"),
  require("../assets/images/ilham_pics/ilham2.jpg"),
  require("../assets/images/ilham_pics/ilham3.jpg"),
  require("../assets/images/ilham_pics/ilham4.jpg"),
  require("../assets/images/ilham_pics/ilham5.jpg"),
];
const DEBUG = false;

const STORY_ITEMS = [
  {
    id: "s1",
    category: "sukran",
    title: "Şükür Anı",
    text: "Bugün aldığın her nefes, unuttuğun nice nimetin sessiz şükrüdür. 🕊️",
  },
  {
    id: "s2",
    category: "niyet",
    title: "Niyetini Tazele",
    text: "Küçük bir ameli büyük yapan, arkasındaki samimi niyettir.",
  },
  {
    id: "s3",
    category: "keder",
    title: "Keder ve Teslimiyet",
    text: "Kalbin kırıldığında bil ki Rabb’in seni daha yükseğe taşıyacak. 🌙",
  },
  {
    id: "s4",
    category: "motivasyon",
    title: "Devam Et",
    text: "Pes etmeyi düşündüğün an, duanın kabulüne en yakın olduğun an olabilir.",
  },
  {
    id: "s5",
    category: "sevgi",
    title: "Kalp İklimi",
    text: "Sevgi, kalbin Allah’a en yakın hâlidir; sevdiğin her şeyde O’nun tecellisini ara.",
  },
  {
    id: "s6",
    category: "cuma",
    title: "Cuma Huzuru",
    text: "Bu mübarek gün, dertlerin değil duaların ağır basacağı bir rahmet kapısıdır.",
  },
  {
    id: "s7",
    category: "stres",
    title: "Huzur Arayışı",
    text: "Nefesini yavaşlat; her nefes, Rabb’ine bir adım daha yaklaşmandır.",
  },
  {
    id: "s8",
    category: "motivasyon",
    title: "Bugün Başla",
    text: "Bir adım bile olsa, doğruya atılan her adım seni bambaşka bir geleceğe taşır.",
  },
  {
    id: "s9",
    category: "niyet",
    title: "Saf Niyet",
    text: "Niyetin temizse, yolun da temiz olur. Rabb’ine bırak; O, kalplerin gizlisini bilir.",
  },
  {
    id: "s10",
    category: "keder",
    title: "Gözyaşı Rahmettir",
    text: "Gözyaşların zayıflık değil; kalbin arınmasının bir işaretidir.",
  },
  {
    id: "s11",
    category: "sukran",
    title: "Nimet Yağmuru",
    text: "Şükrettikçe fark edersin: Nimetler yağmur gibi yağarken sen çoğunu görmemişsin.",
  },
  {
    id: "s12",
    category: "sevgi",
    title: "Kırılgan Kalpler",
    text: "Kalbin kırıldıysa korkma; Allah kırık kalpleri sevgiyle onarır.",
  }
];

const CATEGORIES = [
  { key: "tum", label: "Tümü" },
  { key: "sukran", label: "Şükran" },
  { key: "niyet", label: "Niyet" },
  { key: "keder", label: "Keder" },
  { key: "sevgi", label: "Sevgi" },
  { key: "cuma", label: "Cuma" },
  { key: "stres", label: "Stres" },
  { key: "motivasyon", label: "Motivasyon" },
  { key: "umut", label: "Umut" },
  { key: "sabir", label: "Sabır" },
  { key: "rahmet", label: "Rahmet" },
  { key: "hikmet", label: "Hikmet" },
  { key: "aile", label: "Aile" },
];

// Pinterest-style feed items
const FEED_ITEMS = [
  {
    id: "f1",
    category: "sukran",
    type: "ayet",
    title: "“Eğer şükrederseniz elbette size (nimetimi) artırırım.”",
    ref: "İbrahim 14/7",
    text: "Şükür, nimeti artıran bir dua gibidir. Her küçük nimeti fark etmek kalbi zenginleştirir.",
  },
  {
    id: "f2",
    category: "niyet",
    type: "hadis",
    title: "“Ameller niyetlere göredir...”",
    ref: "Buhârî, Bed’ü’l-vahy, 1",
    text: "Niyetini düzeltmek, hayatını düzeltmenin ilk adımıdır. Her işi Allah rızası için tazele.",
  },
  {
    id: "f3",
    category: "keder",
    type: "ayet",
    title: "“Şüphesiz zorlukla beraber bir kolaylık vardır.”",
    ref: "İnşirah 94/6",
    text: "Yaşadığın her sıkıntının içinde, henüz fark etmediğin bir rahmet saklı olabilir.",
  },
  {
    id: "f4",
    category: "sevgi",
    type: "hadis",
    title: "Allah için sevmek",
    ref: "Ebû Dâvûd, Sünne, 2",
    text: "Birini Allah için sevmek, kalbi dünya menfaatlerinden arındıran en güzel sevgidir.",
  },
  {
    id: "f5",
    category: "cuma",
    type: "söz",
    title: "Cuma bereketi",
    ref: "",
    text: "Cuma, haftanın kalbidir. Bir kalp gibi temizlenip tazelenmek için fırsattır.",
  },
  {
    id: "f6",
    category: "stres",
    type: "ayet",
    title: "“Kalpler ancak Allah’ı anmakla huzur bulur.”",
    ref: "Ra’d 13/28",
    text: "Stres arttığında, zikirle kalbi sakinleştirmek, ruh için derin bir nefes gibidir.",
  },
  {
    id: "f7",
    category: "motivasyon",
    type: "hadis",
    title: "Gücünün yettiği kadar",
    ref: "Buhârî, Îmân, 32",
    text: "Az ama sürekli yapılan amel, hem kalbi diri tutar hem de kulluğu istikrarlı kılar.",
  },
  {
    id: "f8",
    category: "motivasyon",
    type: "soz",
    title: "Düşüşler ve kalkışlar",
    ref: "",
    text: "Mühim olan hiç düşmemek değil; her düşüşten sonra, Rabbine daha da yakın kalkmaktır.",
  },
  {
    id: "f9",
    category: "stres",
    type: "ayet",
    title: "“Daraldığında bana yönel.”",
    ref: "Bakara 2/186",
    text: "İnsanın en büyük huzuru, daraldığında Rabb’ine yönelmesidir. O, kullarına şahdamarından daha yakındır.",
  },
  {
    id: "f10",
    category: "motivasyon",
    type: "hadis",
    title: "Güzel İşlerde Sebat",
    ref: "Müslim, Salât, 283",
    text: "Allah katında en sevimli amel, az da olsa sürekli yapılan ameldir.",
  },
  {
    id: "f11",
    category: "niyet",
    type: "soz",
    title: "Kalbin Aynası",
    ref: "",
    text: "Niyetin, kalbin aynasıdır. Ayna berrak olursa görüntü de berrak olur.",
  },
  {
    id: "f12",
    category: "sevgi",
    type: "hadis",
    title: "Sevgiyle Bağlan",
    ref: "Tirmizî, Zühd, 53",
    text: "Allah için seven, Allah için nefret eden, imanın tadını alır.",
  },
  {
    id: "f13",
    category: "sukran",
    type: "soz",
    title: "Gizli Nimetler",
    ref: "",
    text: "Şükür sadece dile değil, hâle de yakışır. Kalbin şükrettiğinde hayatın değişir.",
  },
  {
    id: "f14",
    category: "keder",
    type: "ayet",
    title: "“Allah sabredenlerle beraberdir.”",
    ref: "Bakara 2/153",
    text: "Kederin en koyu anında bile yalnız değilsin; sabır, rahmete açılan kapıdır.",
  },
  {
    id: "f15",
    category: "cuma",
    type: "soz",
    title: "Mübarek Günün Işığı",
    ref: "",
    text: "Cuma günü dualar göğe daha yakın, gönüller rahmete daha açıktır.",
  },
  {
    id: "f16",
    category: "motivasyon",
    type: "ayet",
    title: "“Umudunu kesme.”",
    ref: "Zümer 39/53",
    text: "Allah’ın rahmetinden umudunu kesme; affı ve merhameti her şeyden büyüktür.",
  },
  {
    id: "f17",
    category: "stres",
    type: "soz",
    title: "Derin Nefes",
    ref: "",
    text: "Kaygı büyüdüğünde bir an dur; kalbini zikre aç, nefesin huzur bulsun.",
  },
  {
    id: "f18",
    category: "umut",
    type: "ayet",
    title: "“Allah’ın rahmetinden umut kesmeyin.”",
    ref: "Zümer 39/53",
    text: "En dar an bile, rahmetin başlangıcı olabilir. Kalp umutla genişler.",
  },
  {
    id: "f19",
    category: "sabir",
    type: "hadis",
    title: "Sabır Işığı",
    ref: "Tirmizî, Birr, 75",
    text: "Sabreden, zorlukların içinden nurla çıkar. Zorluk, imtihanın değil yükselişin kapısıdır.",
  },
  {
    id: "f20",
    category: "rahmet",
    type: "ayet",
    title: "“Rabbim merhamet sahibidir.”",
    ref: "En’am 6/54",
    text: "Yorgun gönüllere dokunan en büyük lütuf O’nun rahmetidir.",
  },
  {
    id: "f21",
    category: "hikmet",
    type: "soz",
    title: "Hikmet Arayışı",
    ref: "",
    text: "Hikmet, kalbe önce sessizlikle iner; gürültüden uzak duran, derinliği duyar.",
  },
  {
    id: "f22",
    category: "aile",
    type: "hadis",
    title: "Ailede Merhamet",
    ref: "Buhârî, Edeb, 18",
    text: "En hayırlınız, ailesine karşı hayırlı olandır.",
  },
  {
    id: "f23",
    category: "sukran",
    type: "ayet",
    title: "Nimetlerin Farkında Ol",
    ref: "Nahl 16/18",
    text: "Nimetleri saymaya kalksanız bitiremezsiniz. Şükür, fark edişin adıdır.",
  },
  {
    id: "f24",
    category: "niyet",
    type: "hadis",
    title: "Niyetin Gücü",
    ref: "Buhârî, Bed’ü’l-vahy, 1",
    text: "Bir iş niyetle büyür. Kalbin yönü doğruysa adımlar da doğru gider.",
  },
  {
    id: "f25",
    category: "motivasyon",
    type: "soz",
    title: "Bugüne Tutun",
    ref: "",
    text: "Dün bitti, yarın bilinmez. Bugün ise Rabb’ine yaklaşmak için fırsattır.",
  },
  {
    id: "f26",
    category: "sevgi",
    type: "ayet",
    title: "“Allah sevdiğini rahmetiyle kuşatır.”",
    ref: "Âl-i İmrân 3/31",
    text: "Sevginin en saf hâli, Allah için olandır.",
  },
  {
    id: "f27",
    category: "keder",
    type: "soz",
    title: "Gece ve Rahmet",
    ref: "",
    text: "En karanlık gece, sabaha en yakın andır. Kederin bittiği yerde teslimiyet başlar.",
  },
  {
    id: "f28",
    category: "stres",
    type: "ayet",
    title: "Huzur Kaynağı",
    ref: "Ra’d 13/28",
    text: "Kalpler ancak Allah’ı anmakla huzur bulur.",
  },
  {
    id: "f29",
    category: "cuma",
    type: "soz",
    title: "Bereket Günü",
    ref: "",
    text: "Cuma, gönüllere nur düşen bir yenilenme günüdür.",
  },
  {
    id: "f30",
    category: "rahmet",
    type: "hadis",
    title: "Rahmet Yağmuru",
    ref: "Müslim, Tevbe, 21",
    text: "Allah’ın rahmeti her şeyi kuşatmıştır; yeter ki kalbin açık olsun.",
  },
  {
    id: "f31",
    category: "umut",
    type: "soz",
    title: "Umut İçten Doğar",
    ref: "",
    text: "Umut, kalpteki dua gibidir; filizlenmesi sabır ister.",
  },
  {
    id: "f32",
    category: "sabir",
    type: "ayet",
    title: "“Allah sabredenlerle beraberdir.”",
    ref: "Bakara 2/153",
    text: "Her sabır, ilahî bir yakınlığın işaretidir.",
  },
  {
    id: "f33",
    category: "hikmet",
    type: "ayet",
    title: "“Hikmeti dilediğine verir.”",
    ref: "Bakara 2/269",
    text: "Hikmet, hem sözde hem sükûtta saklı bir nimettir.",
  },
  {
    id: "f34",
    category: "aile",
    type: "soz",
    title: "Yuvanın Sıcaklığı",
    ref: "",
    text: "Aile, insanın dünyadaki sığınağıdır; sevgiyle büyür, sabırla ayakta kalır.",
  },
  {
    id: "f35",
    category: "sukran",
    type: "soz",
    title: "Derin Şükür",
    ref: "",
    text: "Şükür, nimeti çoğaltmaz sadece; kalbi de zenginleştirir.",
  },
  {
    id: "f36",
    category: "niyet",
    type: "soz",
    title: "Temiz Başlangıç",
    ref: "",
    text: "Niyetini güzelleştir; adımların güzelleşsin.",
  },
  {
    id: "f37",
    category: "motivasyon",
    type: "ayet",
    title: "“Her zorlukla birlikte kolaylık vardır.”",
    ref: "İnşirah 94/6",
    text: "Pes etme; kolaylık, sabrın hemen ardındadır.",
  },
  {
    id: "f38",
    category: "sevgi",
    type: "hadis",
    title: "Allah İçin Sevmek",
    ref: "Ebû Dâvûd, Sünne, 2",
    text: "Allah için sevilen kalpler birbirine rahmet olur.",
  },
  {
    id: "f39",
    category: "keder",
    type: "ayet",
    title: "“Allah darlık ardından genişlik verir.”",
    ref: "Talak 65/7",
    text: "Gözyaşın, rahmetin habercisi olabilir.",
  },
  {
    id: "f40",
    category: "stres",
    type: "soz",
    title: "Nefes Al",
    ref: "",
    text: "Gerginlik arttığında, kalbine dön; huzur içeriden başlar.",
  },
  {
    id: "f41",
    category: "rahmet",
    type: "soz",
    title: "Merhamet Eli",
    ref: "",
    text: "Merhamet, insanı insana yaklaştırır; kuldan kula geçen bir nurdur.",
  },
  {
    id: "f42",
    category: "umut",
    type: "hadis",
    title: "Rahmete Güven",
    ref: "Tirmizî, De’avât, 98",
    text: "Allah kuluna sanıldığı kadar değil; düşünülemeyecek kadar merhametlidir.",
  },
  {
    id: "f43",
    category: "sabir",
    type: "soz",
    title: "Sessiz Güç",
    ref: "",
    text: "Sabır, konuşmayan ama güç veren bir duadır.",
  },
  {
    id: "f44",
    category: "hikmet",
    type: "soz",
    title: "Bilgelik Adımı",
    ref: "",
    text: "Hikmet, tecrübeden değil; doğru bakıştan doğar.",
  },
  {
    id: "f45",
    category: "aile",
    type: "ayet",
    title: "“Onlarda huzur bulursunuz.”",
    ref: "Rum 30/21",
    text: "Aile, huzurun ilahî kök saldığı yerdir.",
  },
  {
    id: "f46",
    category: "sevgi",
    type: "soz",
    title: "Sevginin Bereketi",
    ref: "",
    text: "Sevgiye kattığın samimiyet, hayatına bereket olarak döner.",
  },
  {
    id: "f47",
    category: "keder",
    type: "soz",
    title: "Gönül Yaraları",
    ref: "",
    text: "Kalp kırıldığında, Rabb’in daha yakın olduğu söylenir.",
  },
  {
    id: "f48",
    category: "cuma",
    type: "hadis",
    title: "Dua Saati",
    ref: "Buhârî, Cuma, 37",
    text: "Cuma gününde öyle bir an vardır ki, yapılan dua kabul olunur.",
  },
  {
    id: "f49",
    category: "motivasyon",
    type: "soz",
    title: "Kalk ve Yürü",
    ref: "",
    text: "Bir adım, bin umutsuzluğu dağıtabilir.",
  },
  {
    id: "f50",
    category: "rahmet",
    type: "ayet",
    title: "“Rahmetim gazabımı geçmiştir.”",
    ref: "A’râf 7/156",
    text: "Allah’ın rahmeti, kulun kusurlarından daha geniştir.",
  },
  {
    id: "f51",
    category: "hikmet",
    type: "hadis",
    title: "Sözün Hikmeti",
    ref: "Tirmizî, Da'avât, 66",
    text: "Hikmetli söz, kalbe düşen bir nur gibidir.",
  },
  {
    id: "f52",
    category: "aile",
    type: "soz",
    title: "Kalbin Evi",
    ref: "",
    text: "Aile, kalbin dünyaya attığı köktür; onu suladıkça güçlenir.",
  },
  {
    id: "f53",
    category: "sabir",
    type: "ayet",
    title: "“Sabret; Allah’ın vaadi gerçektir.”",
    ref: "Rum 30/60",
    text: "Geç kalmışlık sandığın şey, aslında tam vaktindedir.",
  },
  {
    id: "f54",
    category: "umut",
    type: "soz",
    title: "Yeniden Başlayış",
    ref: "",
    text: "Her sabah yeni bir rahmet; her nefes yeni bir başlangıçtır.",
  },
  {
    id: "f55",
    category: "stres",
    type: "ayet",
    title: "Dayanak",
    ref: "Ankebut 29/69",
    text: "Allah’a güvenen hiç kimse yalnız bırakılmaz.",
  },
  {
    id: "f56",
    category: "keder",
    type: "soz",
    title: "Ağlamanın Güzelliği",
    ref: "",
    text: "Gözyaşı, kalbin Rabb’ine en yakın hâlidir.",
  },
  {
    id: "f57",
    category: "sevgi",
    type: "soz",
    title: "Temiz Sevgi",
    ref: "",
    text: "Temiz sevgi, kişiyi daha iyi biri olmaya çağırır.",
  },
  {
    id: "f58",
    category: "rahmet",
    type: "soz",
    title: "Sığınak",
    ref: "",
    text: "Rahmet, yorgun ruhun sığınağıdır; insanı tekrar ayağa kaldırır.",
  },
  {
    id: "f59",
    category: "hikmet",
    type: "soz",
    title: "Derin Bakış",
    ref: "",
    text: "Hikmet, olaylara değil; onların ardındaki hikmete bakabilmektir.",
  },
  {
    id: "f60",
    category: "motivasyon",
    type: "soz",
    title: "Azim ve Dua",
    ref: "",
    text: "Azimle atılan adım, dua ile birleştiğinde mucizelere kapı açar.",
  },
  {
    id: "f61",
    category: "aile",
    type: "hadis",
    title: "Güzel Ahlak",
    ref: "Tirmizî, Menâkıb, 63",
    text: "Aile içinde güzel ahlak, evin bereketidir.",
  },
  {
    id: "f62",
    category: "sukran",
    type: "ayet",
    title: "“Rabbinize şükredin.”",
    ref: "Bakara 2/172",
    text: "Şükür, hem nimetin hem kalbin temizliğidir.",
  },
  {
    id: "f63",
    category: "niyet",
    type: "soz",
    title: "Kalbin Yönü",
    ref: "",
    text: "Niyet, yolun pusulasıdır; yönün doğruysa yolculuğun da hayırlı olur.",
  },
  {
    id: "f64",
    category: "sabir",
    type: "soz",
    title: "Dayanma Gücü",
    ref: "",
    text: "Sabır, insanın kendine söylediği sessiz bir 'devam et' cümlesidir.",
  },
  {
    id: "f65",
    category: "umut",
    type: "ayet",
    title: "“Allah kolaylık diler.”",
    ref: "Bakara 2/185",
    text: "Her zorluğun ardında ilahî bir kolaylık gizlidir.",
  },
  {
    id: "f66",
    category: "rahmet",
    type: "ayet",
    title: "“Kullarım için merhametim geniştir.”",
    ref: "Hicr 15/49",
    text: "Merhamet, insanın umudunu canlı tutan ışıktır.",
  },
  {
    id: "f67",
    category: "hikmet",
    type: "soz",
    title: "Düşünmenin Değeri",
    ref: "",
    text: "Düşünmeden geçen bir gün, hikmetin kapısından uzaklaşmak demektir.",
  },
  {
    id: "f68",
    category: "aile",
    type: "soz",
    title: "Birlikte Güç",
    ref: "",
    text: "Ailede birlik, imanda sağlamlığa benzer; birbirini tamamlar.",
  },
  {
    id: "f69",
    category: "stres",
    type: "soz",
    title: "Dinginlik",
    ref: "",
    text: "Dinginlik, her şeyi çözmek değil; her şeyle barışmayı öğrenmektir.",
  },
  {
    id: "f70",
    category: "keder",
    type: "ayet",
    title: "“Allah size zafer verecektir.”",
    ref: "Muhammed 47/7",
    text: "Keder, zaferden önce gelen sabırdır.",
  }
];

export default function IlhamPage({ onBack }) {
  const [activeCategory, setActiveCategory] = useState("tum");

  // Story modal state
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [likedStories, setLikedStories] = useState({}); // {id: true/false}
  const [backgroundSource, setBackgroundSource] = useState();

  // Feed item modal state
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredFeed = useMemo(
    () =>
      activeCategory === "tum"
        ? FEED_ITEMS
        : FEED_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const leftColumn = filteredFeed.filter((_, idx) => idx % 2 === 0);
  const rightColumn = filteredFeed.filter((_, idx) => idx % 2 === 1);

  function openStory(index) {
    setActiveStoryIndex(index);
    setStoryModalVisible(true);
    const pic = STORY_PICS[index % STORY_PICS.length]; 
    setBackgroundSource(STORY_PICS[pic]);
  }

  function closeStory() {
    setStoryModalVisible(false);
  }

  function handleNextStory() {
    if (activeStoryIndex < STORY_ITEMS.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
    } else {
      // last story -> close
      setStoryModalVisible(false);
    }
  }

  function handlePrevStory() {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    }
  }

  function toggleLikeCurrentStory() {
    const story = STORY_ITEMS[activeStoryIndex];
    setLikedStories((prev) => ({
      ...prev,
      [story.id]: !prev[story.id],
    }));
  }

  function getTypeLabel(type) {
    switch (type) {
      case "ayet":
        return "📖 Ayet";
      case "hadis":
        return "📜 Hadis";
      default:
        return "✨ İlham Verici Söz";
    }
  }

  async function shareText(text, titlePrefix = "İlham") {
    try {
      await Share.share({
        message: `${titlePrefix}:\n\n${text}\n\n📱 İslam Yolu ile paylaşıldı.`,
      });
    } catch (e) {
      if (DEBUG) console.log("Share error:", e);
    }
  }

  return (
    <View style={styles.overlay}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
        <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
      </TouchableOpacity>

      <Text style={styles.ilhamTitle}>İlham</Text>
      <Text style={styles.ilhamSubtitle}>
        Güzel dinimizi hakkıyla yaşayıp Allah&apos;ın rızasına layık olmaya
        çalışalım. İlham almak için bu sayfadaki içeriklere göz atın; gönlünüzce
        paylaşıp sevdiklerinizin de ilham almasına vesile olun.
      </Text>

      {/* TOP: Stories row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ styles.storiesRow } contentContainerStyle={{ paddingRight: 8 }} >
        {STORY_ITEMS.map((story, index) => {
          const liked = likedStories[story.id];
          return (
            <TouchableOpacity key={story.id} style={styles.storyCard} activeOpacity={0.8} onPress={() => openStory(index)} >
              <View>
                <ScaledText baseSize={12} style={styles.storyTitle}> {story.title} </ScaledText>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* SECOND ROW: Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow} contentContainerStyle={{ paddingRight: 8 }} >
        {CATEGORIES.map((cat) => {
          const active = cat.key === activeCategory;
          return (
            <TouchableOpacity key={cat.key} style={[styles.categoryChip, active && styles.categoryChipActive]} onPress={() => setActiveCategory(cat.key)}  >
              <ScaledText baseSize={12} style={[ styles.categoryChipText, active && styles.categoryChipTextActive, ]} >
                {cat.label}
              </ScaledText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* MAIN: Pinterest-style feed */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.feedContainer} >
        <View style={styles.feedColumn}>
          {leftColumn.map((item) => (
            <TouchableOpacity key={item.id} style={styles.feedCard} activeOpacity={0.9} onPress={() => setSelectedItem(item)} >
              <ScaledText baseSize={14} style={styles.feedType}>
                {getTypeLabel(item.type)}
              </ScaledText>
              <ScaledText baseSize={14} style={styles.feedTitle}>
                {item.title}
              </ScaledText>
              {item.ref ? ( <ScaledText baseSize={12} style={styles.feedRef}> {item.ref} </ScaledText> ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.feedColumn}>
          {rightColumn.map((item) => (
            <TouchableOpacity key={item.id} style={styles.feedCard} activeOpacity={0.9} onPress={() => setSelectedItem(item)} >
              <ScaledText baseSize={14} style={styles.feedType}>
                {item.type === "ayet" ? "📖 Ayet" : item.type === "hadis" ? "📜 Hadis" : "✨ Söz"}
              </ScaledText>
              <ScaledText baseSize={14} style={styles.feedTitle}>
                {item.title}
              </ScaledText>
              {item.ref ? ( <ScaledText baseSize={12} style={styles.feedRef}> {item.ref} </ScaledText> ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* STORY MODAL */}
      <Modal visible={storyModalVisible} transparent animationType="fade" onRequestClose={closeStory} >
        <View style={styles.storyModalOverlay}>
          <ImageBackground source={backgroundSource} style={styles.storyModalCardBackground} imageStyle={styles.storyModalCardImage} resizeMode="cover" > 
            <View style={styles.storyModalCardInner}>
              {STORY_ITEMS[activeStoryIndex] && (
                <>
                  <Text style={styles.storyModalCategory}>
                    {CATEGORIES.find( (c) => c.key === STORY_ITEMS[activeStoryIndex].category )?.label || "İlham"}
                  </Text>
                  <Text style={styles.storyModalTitle}>
                    {STORY_ITEMS[activeStoryIndex].title}
                  </Text>
                  <ScrollView style={{ marginTop: 8 }} showsVerticalScrollIndicator={false} >
                    <Text style={styles.storyModalText}>
                      {STORY_ITEMS[activeStoryIndex].text}
                    </Text>
                  </ScrollView>

                  <View style={styles.storyModalButtonsRow}>
                    <TouchableOpacity onPress={toggleLikeCurrentStory} style={styles.storyModalButton} >
                      <Text style={styles.storyModalButtonText}>
                        {likedStories[STORY_ITEMS[activeStoryIndex].id] ? "♥ Beğenildi" : "♡ Beğen"} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => shareText( STORY_ITEMS[activeStoryIndex].text, STORY_ITEMS[activeStoryIndex].title ) } style={styles.storyModalButton} >
                      <Text style={styles.storyModalButtonText}>↗ Paylaş</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.storyModalFooterNav}>
                    <TouchableOpacity onPress={handlePrevStory} disabled={activeStoryIndex === 0} style={[ styles.storyNavBtn, activeStoryIndex === 0 && styles.storyNavBtnDisabled, ]} >
                      <Text style={styles.storyNavText}>Önceki</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={closeStory} style={styles.storyNavBtn}>
                      <Text style={styles.storyNavText}>Kapat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNextStory} style={styles.storyNavBtn}  >
                      <Text style={styles.storyNavText}> {activeStoryIndex === STORY_ITEMS.length - 1 ? "Bitir" : "Sonraki"} </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ImageBackground>
        </View>
      </Modal>

      {/* FEED ITEM MODAL */}
      <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)} >
        <View style={styles.itemModalOverlay}>
          <View style={styles.itemModalCard}>
            {selectedItem && (
              <>
                <Text style={styles.itemModalType}> {getTypeLabel(selectedItem.type)} </Text>
                <Text style={styles.itemModalTitle}>{selectedItem.title}</Text>
                {selectedItem.ref ? ( <Text style={styles.itemModalRef}>{selectedItem.ref}</Text> ) : null}

                <ScrollView style={{ marginTop: 8 }} showsVerticalScrollIndicator={false} >
                  <Text style={styles.itemModalText}>{selectedItem.text}</Text>
                </ScrollView>

                <View style={styles.itemModalButtonsRow}>
                  <TouchableOpacity style={styles.itemModalButton} onPress={() => setSelectedItem(null)} >
                    <Text style={styles.itemModalButtonText}>Kapat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.itemModalButton} onPress={() => shareText( `${selectedItem.title}\n${selectedItem.ref || ""}\n\n${ selectedItem.text }`, "İlham" )  } >
                    <Text style={styles.itemModalButtonText}>↗ Paylaş</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  ilhamTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },
  ilhamSubtitle: {
    fontSize: 14,
    color: "#d0d7e2",
    textAlign: "center",
    marginBottom: 10,
  },

  // Stories row
  storiesRow: {
    marginTop: 6,
    maxHeight: 120,
  },
  storyCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems:'center',
  },
  storyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffdd55",
    marginBottom: 4,
    textAlign: "center",
  },

  // Categories
  categoriesRow: {
    maxHeight: 44,
    marginTop: 4,
    marginBottom: 4,
  },
  categoryChip: {
    height: 36,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    marginRight: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: "#ffdd55",
    borderColor: "#ffdd55",
  },
  categoryChipText: {
    fontSize: 13,
    color: "#e0e6f0",
    textAlign: "center",
  },
  categoryChipTextActive: {
    color: "#333333",
    fontWeight: "600",
  },

  // Feed
  feedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom : 50
  },
  feedColumn: {
    flex: 1,
  },
  feedCard: {
    marginBottom: 10,
    marginRight: 4,
    marginLeft: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  feedType: {
    fontSize: 12,
    color: "#ffdd88",
    marginBottom: 4,
  },
  feedTitle: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 4,
  },
  feedRef: {
    fontSize: 11,
    color: "#d0d7e2",
  },

  // Story modal
  storyModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.63)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  storyModalCategory: {
    fontSize: 13,
    color: "#ffdd88",
    marginBottom: 4,
  },
  storyModalTitle: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 4,
  },
  storyModalCardBackground: {
    width: "100%",
    height: "55%",
    borderRadius: 20,
    overflow: "hidden", // must-have!
  },
  storyModalCardImage: {
    borderRadius: 20,
  },
  storyModalCardInner: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(10,10,15,0.85)", // translucent so image shows through
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  storyModalContent: {
  flex: 1,
  padding: 16,
  backgroundColor: "rgba(202, 202, 202, 0.13)", // semi-dark layer to make text readable
},
  storyModalText: {
    fontSize: 15,
    color: "#e5e5f0",
    lineHeight: 22,
  },
  storyModalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  storyModalButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  storyModalButtonText: {
    fontSize: 14,
    color: "#ffffff",
  },
  storyModalFooterNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  storyNavBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  storyNavBtnDisabled: {
    opacity: 0.3,
  },
  storyNavText: {
    color: "#ffffff",
    fontSize: 13,
  },

  // Item modal
  itemModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  itemModalCard: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(10,10,15,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  itemModalType: {
    fontSize: 13,
    color: "#ffdd88",
    marginBottom: 4,
  },
  itemModalTitle: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 4,
  },
  itemModalRef: {
    fontSize: 12,
    color: "#d0d7e2",
    marginBottom: 6,
  },
  itemModalText: {
    fontSize: 14,
    color: "#e5e5f0",
    lineHeight: 22,
  },
  itemModalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  itemModalButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  itemModalButtonText: {
    fontSize: 14,
    color: "#ffffff",
  },
});
