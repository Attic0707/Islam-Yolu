import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, } from "react-native";
import ScaledText from "./ScaledText";

export default function TecvidPage({ onBack }) {
  const [selectedRuleId, setSelectedRuleId] = useState();
  const RULES = [
    {
      id: "0",
      title: "Tecvid",
      arabic: "تجويد",
    },
    {
        id: "1",
        title: "Mahreç",
        arabic: "مخارج الحروف",
    },
    {
        id: "2",
        title: "Sâkin nun",
        arabic: "",
    },
    {
        id: "3",
        title: "Sâkin mim",
        arabic: "",
    },
    {
        id: "4",
        title: "Kalkale",
        arabic: "ق ط د ج ب ",
    },
    {
        id: "5",
        title: "Vakf",
        arabic: ""
    },
    {
        id: "6",
        title: "Üslub",
    },
  ];

  const DETAILS = [
    {
      parentId: "0",
      title: "Tanım",
      description: 
      "Tecvid, Kıraat ilmi içinde yer alan, Kur'an okuma usulü ve ilmidir.Harflerin mahreçlerine, sıfatına, medlere uygun okumaktır.\n" + 
      "Kelime manası olarak tecvid, cewede جود kökünden gelip, bir şeyi güzel yapmak, süslemek, hoşça yapmak anlamına gelir.\n" + 
      "Cewde جودة Arapçada kalite demek olur ki, bir şey çok güzel olduğu zaman kullanılır. Kur'an'ı çok güzel ve kuralına göre okuyan insana, \n" + 
      "Kuran'ı okumasıyla güzelleştiren manasında “mucevvid” denir.",
    },
    {
      parentId: "0",
      title: "",
      description: 
      "Terim manası ise harfin hakkının verilerek çıkış yerine göre, gerek zati (her zaman onda bulunan, yani harften ayrılmayan,\n" + 
      "belirtilmediğinde genellikle namazın bozulduğu) gerekse arızi (değişikliğe uğrayan, başka bir deyişle harften kalktığında harfin zatını değiştirmeyen, namazın bozulmasına neden olmayan) sıfatların hakkı verilerek Kur'an'ın okunmasıdır.\n" + 
      "Aşir okumasında tertil denilen usul uygulanır. Tertil, Kur'an'ın tecvid usullerini tam uygulayarak ağır okumak demektir. Hatim ve namazda tedvir -hızlı okuma- yapılır. Çok hızlı okumaya hadr denir.\n"+
      "Fakat hızlı okuma veya yavaş okuma, tecvid kurallarını kusursuz yerine getirmekle yapılır. Hızlı okunduğunda tecvid kurallarında eksiklik olmamalıdır.\n"+
      "Türkiye'de okutulan en meşhur tecvid kitabı Karabaş Tecvidi'dir.",
    },
    {
      parentId: "0",
      title: "Farzlık hali",
      description: 
      "Tecvid kurallarının bilinmesi farzı kifayedir, yani her bir toplumda en az bir kişinin bilmesi gerekir.",
    },
    {
      parentId: "1",
      title:  "Tanım",
      description:
        "Her harfin ağız ve boğaz içinde çıktığı belirli bir nokta vardır. Harflerin doğru okunması için bu mahreçlerin iyi öğrenilmesi gerekir. 17 tane mahreç vardır. Harflerin sıfatları da, harflerin farklı özelliklerine bağlıdır.",
      example:
        "Örneğin 'ق' harfi gırtlağa yakın bir noktadan, 'ب' harfi ise dudaklardan çıkar.",
    },
    {
      parentId: "1",
      title:  "Kalınlık ve incelik",
      description: "Kalın harfler خ ص ض ط ظ غ ق mufahham diye de bilinir. Tefhim ile telaffuz edilirler. Kalan harfler (murakkak) normal telaffuz edilir.",
      example:
        "Örneğin 'ق' harfi gırtlağa yakın bir noktadan, 'ب' harfi ise dudaklardan çıkar.",
    },
    {
      parentId: "1",
      title:  "",
      description: "Ra ر harfi üstün veya ötre ile olduğu zaman kalın, esre ile olduğu zaman ince okunur. Eğer durulacak ise, bir önceki harekesi bulunan harfin harekesine bakılır. Eğer üstün veya ötre ise bu hareke, kalındır. Esre ise incedir. Örneğin, Asr suresinin ilk kelimesinin sonundaki ra ر kalındır, çünkü ayn harfinin harekesi üstündür: \n" + "وَالْعَصْرِ",
      example:
        "Örneğin 'ق' harfi gırtlağa yakın bir noktadan, 'ب' harfi ise dudaklardan çıkar.",
    },
    {
      parentId: "1",
      title:  "Uzatma",
      description: "Uzatma harekeli bir harften sonra med harfi ا ي و gelmesiyle olur. Uzatma bu şekilde iki olur. \n" + "Eğer uzatmanın üzerinde med işareti varsa daha da uzun olur. Med işaretinden sonra hemze gelirse dört veya beş, şedde gelirse altı uzunlukta okunur. Örneğin: \n" + "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلمَغْضُوبِ عَلَيْهِمْ وَلاَ ٱلضَّآلِّين",
      example:
        "Örneğin 'ق' harfi gırtlağa yakın bir noktadan, 'ب' harfi ise dudaklardan çıkar.",
    },
    {
      parentId: "2",
      title:  "Okunuş",
      description: "Bir sonraki harf eğer, " + "  ء ه ع ح غ خ" +  "harflerinden biriyse, 'nun' harfine bir değişiklik olmadan okunur.",
      example: ""
    },
    {
      parentId: "2",
      title:  "İklab",
      description: "Eğer nun harfinden sonra gelen harf b ب ise, nun harfi m sesine dönüşür ve gunne (2 uzunluğunda, burundan okuma) ile okunur.",
      example: ""
    },
    {
      parentId: "2",
      title:  "İdgam",
      description:"Eğer bir sonraki harf ن و م ي ل ر ise, nun okunmaz ve son dört harfte gunne vardır. İdgam sadece iki kelime arasındadır, bir kelimenin ortasında değil.",
      example:""
    },
    {
      parentId: "2",
      title:  "İhfa",
      description:"Bu harfler dışındaki harflerde dil damağa tam değmez ve nun harfi tam okunmaz. Gunne vardır.",
      example:""
    },
    {
      parentId: "3",
      title:  "Okunuş",
      description: "Mim harfinin sükunlu haline denir. Bir sonraki harfe bağlı olarak, 3 şekilde okunur:",
      example: ""
    },
    {
      parentId: "3",
      title:  "1.)",
      description: "Bir sonraki harf mim ise, şedde ile gösterilir ve gunne içerir.",
      example: ""
    },
    {
      parentId: "3",
      title:  "2.)",
      description: "B ب harfi ile devam ediyorsa, dudaklar tam birbirine değmez. Gunne içerir. Fil suresinden örnek: تَرْمِيهِمْ بِحِجَارَةٍ",
      example: ""
    },
    {
      parentId: "3",
      title: "3.)",
      description: "Yukarıdaki harfler değilse, normal okunur.",
      example: ""
    },
    {
      parentId: "4",
      title: "Okunuş",
      description: "ق ط د ج ب\n" + " harfleri, kelimenin ortasında veya sonunda ise ve sükun (ya da şedde) alırsa, vurgulu okunur." + "Az vurgu eğer harf kelime ortasındaysa ya da sonunda ama okuyucu bir sonraki harfle birleştirirse olur. Orta seviye vurgu eğer harf kelime sonundaysa ve şeddeli değilse olur.",
      example:""
    },
    {
      parentId: "5",
      title: "Okunuş",
      description: "Vakf, Arapçadaki durma kuralıdır. Son harfi harekeyle biten bütün kelimeler, durulacaksa sükun hale gelir. Son harfe göre kurallar şöyledir:",
      example:""
    },
    {
      parentId: "5",
      title: "Kelimenin harekeyle biten son harfi",
      description: "ء (أ إ ئ ؤ) ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي\n"+"Hangi harekeyle biterse bitsin",
      example:""
    },
    {
      parentId: "5",
      title: "Vakf ile okunurken dönüştüğü hal",
      description: "Sükun /∅/",
      example:""
    },
    {
      parentId: "5",
      title: "Örnekler",
      description: "بَيْتْ - بَيْتٌ ev\n" +"اَلرَّبّْ - اَلرَّبُّ Rab\n"+"مُسْتَشْفَى - مُسْتَشْفًى Hastane \n" + "شُكْرَا - شُكْرًا Teşekkürler",
      example:""
    },
    {
      parentId: "6",
      title:  "Kalbin hali",
      description:
        "Kişi mütevazı olmalıdır.\n" + 
        "Kişi Kur'an'ın insan kelamı olmadığını anlamalıdır.\n" +
        "Kişi ayetlerin manaları üzerine düşünmelidir.\n" + 
        "Kişi dikkat dağıtan fikirlerden uzak durmalıdır.\n" + 
        "Kişi Kur'an'daki her mesajın kendisi için olduğunu hissetmelidir.",
      example:""
    },
    {
      parentId: "6",
      title:  "Vücut hali",
      description:
        "Kişi vücudunun, kıyafetlerinin ve mekanın temizliğinin farkında olmalıdır.\n" + 
        "Kıbleye dönmek tavsiye edilir.\n" +
        "Kişi uyarı ayetlerinde durmalı ve Allah'a sığınmalıdır.\n" + 
        "Kişi merhamet ayetlerinde durmalı ve Allah'tan merhamet istemelidir.\n" + 
        "Doğru telaffuz kullanmalıdır.\n" +
        "Abdesti olmalı ve sadece Allah rızası için okumalıdır.",
      example:""
    },
  ];

  return (
    <View style={[ styles.overlay, { justifyContent: "flex-start", paddingHorizontal: 20 }, ]}  >
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
        <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
      </TouchableOpacity>
      
      <Text style={styles.guideTitle}>Tecvid Kılavuzu</Text>
      <Text style={styles.guideSubtitle}>Tecvidli okumak nedir, nasıl okunur? </Text>

      <View style={styles.scrollParent}>
        <View style={{ width: "30%" }}>
          <ScrollView style={{ marginTop: 12, marginBottom: 90, marginRight: 8 }}>
            {RULES.map((r, index) => (
                <TouchableOpacity key={index} style={styles.guideCard} onPress={() => setSelectedRuleId(r.id)} activeOpacity={0.4}> 
                  <ScaledText baseSize={14} style={styles.guideStepTitle}> {r.title} </ScaledText> 
                  <ScaledText baseSize={14} style={styles.guideStepText}> {r.arabic} </ScaledText>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ width: "70%" }}>
          <ScrollView style={{ marginTop: 12, marginBottom: 90 }}>
            {DETAILS
            .filter(d => d.parentId === selectedRuleId)
            .map((d, index) => (
                <View key={index} style={styles.guideCard}>
                    <ScaledText baseSize={14} style={styles.guideStepTitle}> {d.title} </ScaledText>
                    <ScaledText baseSize={14} style={styles.guideStepText}> {d.description} </ScaledText>
                </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );

}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#02170878",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },
  scrollParent: {
    flexDirection: "row",
    flex: 1,
  },  
  contentRow: {
    flexDirection: "column",
  },
  guideSubtitle: {
    fontSize: 14,
    color: "#d0d7e2",
    textAlign: "center",
    marginBottom: 12,
  },
  guideCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  guideStepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffdd55",
    marginBottom: 4,
  },
  guideStepText: {
    fontSize: 14,
    color: "#f2f2f7",
    lineHeight: 20,
  },
});
