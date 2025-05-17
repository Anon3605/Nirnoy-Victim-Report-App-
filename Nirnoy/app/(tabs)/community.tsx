import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

interface AwarenessVideo {
  title: string;
  embedUtubeLink: string;
}

const defaultData: AwarenessVideo[] = [
  {
    title: "Violence Awareness - Video 1",
    embedUtubeLink: "https://www.youtube.com/embed/hF9fHiJUV-8?si=9vMC0oqKvRm-hpti",
  },
  {
    title: "Emergency Response Education - Video 2",
    embedUtubeLink: "https://www.youtube.com/embed/MG5Awm1TVOU?si=KyACA0c78cEvDBMl",
  },
];

export default function AwarenessCommunity() {
  const [videos, setVideos] = useState<AwarenessVideo[]>(defaultData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommunityVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://192.168.1.115:8000/api/community");
        const data = await res.json();
        if (Array.isArray(data)) {
          setVideos(data); // Replace default with backend data
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityVideos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Awareness Videos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.videoCard}>
              <Text style={styles.title}>{item.title}</Text>
              <WebView
                originWhitelist={['*']}
                source={{ uri: item.embedUtubeLink }}
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                style={styles.webview}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  videoCard: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  webview: {
    height: 200,
  },
});
