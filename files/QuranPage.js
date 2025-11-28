import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";

export default function QuranPage({ onBack }) {
  const [chapters, setChapters] = useState([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [chaptersError, setChaptersError] = useState(null);

  const [currentChapterId, setCurrentChapterId] = useState(1); // start from Fatiha
  const [currentChapterName, setCurrentChapterName] = useState("Al-Fatiha");
  const [currentChapterNameTr, setCurrentChapterNameTr] = useState("Fâtiha Suresi");

  const [verses, setVerses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [versesLoading, setVersesLoading] = useState(false);
  const [versesError, setVersesError] = useState(null);

  const [chapterModalVisible, setChapterModalVisible] = useState(false);

  // --- Load surah list (chapters) once ---
  useEffect(() => {
    async function loadChapters() {
      try {
        setChaptersLoading(true);
        setChaptersError(null);

        const res = await fetch(
          "https://api.quran.com/api/v4/chapters?language=tr"
        );
        const json = await res.json();

        if (!json.chapters) {
          throw new Error("Chapters response format unexpected");
        }

        // chapters are already in correct mushaf order (1..114)
        setChapters(json.chapters);

        // default to Fatiha (id=1)
        const fatiha = json.chapters.find((c) => c.id === 1) || json.chapters[0];
        if (fatiha) {
          setCurrentChapterId(fatiha.id);
          setCurrentChapterName(fatiha.name_simple); // latin
          setCurrentChapterNameTr(fatiha.translated_name?.name || "");
        }
      } catch (e) {
        console.log("Chapters error:", e);
        setChaptersError("Sûre listesi yüklenirken bir hata oluştu.");
      } finally {
        setChaptersLoading(false);
      }
    }

    loadChapters();
  }, []);

  // --- Load verses whenever chapter or page changes ---
  useEffect(() => {
    if (!currentChapterId) return;

    async function loadVerses() {
      try {
        setVersesLoading(true);
        setVersesError(null);

        const url = `https://api.quran.com/api/v4/verses/by_chapter/${currentChapterId}?language=ar&words=false&page=${page}&per_page=10&fields=text_uthmani`;
        const res = await fetch(url);
        const json = await res.json();

        if (!json.verses) {
          throw new Error("Verses response format unexpected");
        }

        setVerses(json.verses || []);
        if (json.pagination) {
          setTotalPages(json.pagination.total_pages || 1);
        } else {
          setTotalPages(1);
        }
      } catch (e) {
        console.log("Verses error:", e);
        setVersesError("Ayetler yüklenirken bir hata oluştu.");
      } finally {
        setVersesLoading(false);
      }
    }

    loadVerses();
  }, [currentChapterId, page]);

  function openChapterModal() {
    setChapterModalVisible(true);
  }

  function closeChapterModal() {
    setChapterModalVisible(false);
  }

  function handleSelectChapter(chapter) {
    setCurrentChapterId(chapter.id);
    setCurrentChapterName(chapter.name_simple);
    setCurrentChapterNameTr(chapter.translated_name?.name || "");
    setPage(1); // reset to first page of that surah
    setChapterModalVisible(false);
  }

  function goPrevPage() { 
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  }

  function goNextPage() {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={{ color: "#fff", fontSize: 20 }}>←</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Kur’an-ı Kerim</Text>

      {/* Surah selector bar */}
      <View style={styles.surahBar}>
        {chaptersLoading ? (
          <ActivityIndicator color="#eab308" />
        ) : chaptersError ? (
          <Text style={styles.errorText}>{chaptersError}</Text>
        ) : (
          <>
            <TouchableOpacity
              style={styles.surahSelector}
              onPress={openChapterModal}
            >
              <Text style={styles.surahSelectorNumber}>
                {currentChapterId}.
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.surahSelectorName}>
                  {currentChapterNameTr} Suresi
                </Text>
              </View>
              <Text style={styles.surahSelectorChevron}>▾</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Book-like page */}
      <View style={styles.bookWrapper}>
        <View style={styles.bookShadow}>
          <View style={styles.bookPage}>
            {/* Page Header inside book */}
            <View style={styles.bookHeaderRow}>
              <Text style={styles.bookHeaderSurah}>
                {currentChapterId}. {currentChapterNameTr || currentChapterName}
              </Text>
              <Text style={styles.bookHeaderPage}>
                Sayfa {page}/{totalPages}
              </Text>
            </View>

            {/* Verses */}
            {versesLoading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator color="#eab308" />
                <Text style={styles.loadingText}>Ayetler yükleniyor…</Text>
              </View>
            ) : versesError ? (
              <View style={styles.centerContent}>
                <Text style={styles.errorText}>{versesError}</Text>
              </View>
            ) : (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.versesContainer}
                showsVerticalScrollIndicator={false}
              >
                {verses.map((v) => {
                  const ayahNumber =
                    v.verse_key && v.verse_key.includes(":")
                      ? v.verse_key.split(":")[1]
                      : "";
                  return (
                    <Text key={v.id} style={styles.verseText}>
                      <Text style={styles.ayahNumber}>﴿{ayahNumber}﴾ </Text>
                      {v.text_uthmani || v.text}
                    </Text>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.paginationRow}>
              <TouchableOpacity style={[ styles.pageButton, page <= 1 && styles.pageButtonDisabled, ]} onPress={goNextPage} disabled={page <= 1} > 
                <Text style={[ styles.pageButtonText, page >= totalPages && styles.pageButtonTextDisabled, ]} >
                  Önceki sayfa →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[ styles.pageButton, page >= totalPages && styles.pageButtonDisabled, ]} onPress={goPrevPage}  disabled={page >= totalPages} >
                <Text style={[ styles.pageButtonText, page <= 1 && styles.pageButtonTextDisabled, ]} >
                  ← Sonraki sayfa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Surah selection modal */}
      <Modal visible={chapterModalVisible} transparent animationType="fade" onRequestClose={closeChapterModal} >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sûre Seç</Text>
            <ScrollView style={{ maxHeight: "80%" }} showsVerticalScrollIndicator={false} >
              {chapters.map((ch) => (
                <TouchableOpacity key={ch.id} style={[ styles.modalSurahRow, ch.id === currentChapterId && styles.modalSurahRowActive, ]}  onPress={() => handleSelectChapter(ch)} >
                  <Text style={styles.modalSurahNumber}>{ch.id}.</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalSurahName}>
                      {ch.translated_name.name} Sûresi
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={closeChapterModal} style={styles.modalCloseBtn} >
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021708c9",
    paddingTop: 60,
    paddingHorizontal: 20
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
  },
  header: {
    color: "#f9fafb",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },

  // Surah selector
  surahBar: {
    marginBottom: 12,
  },
  surahSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(148,163,184,0.7)",
  },
  surahSelectorNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#eab308", // amber
    marginRight: 10,
  },
  surahSelectorName: {
    fontSize: 15,
    color: "#e5e7eb",
    fontWeight: "600",
  },
  surahSelectorNameTr: {
    fontSize: 13,
    color: "#9ca3af",
  },
  surahSelectorChevron: {
    fontSize: 18,
    color: "#e5e7eb",
    marginLeft: 8,
  },

  // Book UI
  bookWrapper: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 100
    
  },
  bookShadow: {
    flex: 1,
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
  bookPage: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "rgba(15,23,42,0.92)", // deep slate
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(248,250,252,0.12)",
  },
  bookHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bookHeaderSurah: {
    fontSize: 15,
    fontWeight: "600",
    color: "#facc15",
  },
  bookHeaderPage: {
    fontSize: 13,
    color: "#9ca3af",
  },

  versesContainer: {
    paddingVertical: 4,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 30,
    color: "#e5e7eb",
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl", // RTL for Arabic
  },
  ayahNumber: {
    fontSize: 16,
    color: "#facc15",
  },

  paginationRow: {
    flexDirection: "row-reverse", // RTL: right side is "previous"
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  pageButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(234,179,8,0.12)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(250,204,21,0.5)",
    alignItems: "center",
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 14,
    color: "#facc15",
    fontWeight: "600",
  },
  pageButtonTextDisabled: {
    color: "#9ca3af",
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#e5e7eb",
    fontSize: 13,
  },
  errorText: {
    color: "#fecaca",
    fontSize: 13,
  },

  // Surah modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "rgba(15,23,42,0.98)",
    borderRadius: 18,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(148,163,184,0.8)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSurahRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 2,
  },
  modalSurahRowActive: {
    backgroundColor: "rgba(250,204,21,0.12)",
  },
  modalSurahNumber: {
    fontSize: 14,
    color: "#facc15",
    width: 36,
  },
  modalSurahName: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  modalSurahNameTr: {
    fontSize: 12,
    color: "#9ca3af",
  },
  modalCloseBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#facc15",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
});
