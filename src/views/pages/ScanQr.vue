<template>
  <div class="flex flex-col items-center ml-auto mr-8">
    <h1 class="text-2xl font-semibold mb-4">QR Code Reader</h1>
    <div class="w-full max-w-md">
      <video ref="video" autoplay class="rounded-lg shadow-lg"></video>
    </div>
    <div class="mt-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-lg">
      <p class="font-semibold">Petunjuk Penggunaan:</p>
      <ul class="list-disc list-inside">
        <li>Pastikan QR Code berada dalam bingkai kamera.</li>
        <li>Jaga jarak agar QR Code tidak terlalu dekat atau terlalu jauh.</li>
        <li>Pastikan pencahayaan cukup untuk hasil yang lebih baik.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";  
import jsQR from "jsqr";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "QrCodeReader",
  setup() {
    const video = ref(null);
    const router = useRouter(); 

    const startCamera = () => {
      if (video.value) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" } })
          .then((stream) => {
            video.value.srcObject = stream;
            video.value.setAttribute("playsinline", true);
            scanQRCode();
          })
          .catch((error) => {
            console.error("Error accessing the camera:", error);
            alert("Error accessing the camera. Please check permissions.");
          });
      }
    };

    const scanQRCode = () => {
      const canvasElement = document.createElement("canvas");
      const ctx = canvasElement.getContext("2d");

      const scan = () => {
        if (video.value && video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
          canvasElement.width = video.value.videoWidth;
          canvasElement.height = video.value.videoHeight;
          ctx.drawImage(video.value, 0, 0, canvasElement.width, canvasElement.height);

          const imgData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);

          if (code) {
            console.log("QR Code detected:", code.data);
            const token = localStorage.getItem("token");

            axios
              .get( apiUrl + `/api/assets/hash`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: { hash_id: code.data },
              })
              .then((response) => {
                if (response.status === 200) {
                  console.log("Valid QR Code, redirecting...");
                  router.push({ name: "ViewAsetScan", params: { IdHash: code.data } });
                } else {
                  throw new Error("Invalid response status");
                }
              })
              .catch((error) => {
                console.error("Error validating QR Code:", error);
                // Do not redirect to 404, continue scanning
              });

            return;
          }
        }

        requestAnimationFrame(scan);
      };

      scan();
    };

    onMounted(() => {
      startCamera();
    });

    onUnmounted(() => {
      if (video.value && video.value.srcObject) {
        const stream = video.value.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    });

    return {
      video,
    };
  },
};
</script>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}
</style>