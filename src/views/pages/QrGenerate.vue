<template>
  <CCol :xs="12">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Generate QR Code Aset</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol :lg="6">
            <CCard class="mb-3">
              <CCardImage orientation="top" ref="cardImage" />
              <canvas id="qrcode" ref="qrcode" class="mx-auto block"
                style="width: 90%; max-width: 700px; height: auto;"></canvas>
              <button @click="downloadQRCode" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-red-500">
                Download QR Code
              </button>
              <CCardBody>
                <strong>Spesifikasi Aset:</strong>
                <CCardText>
                  {{ asetData.assetSpecification || 'Tidak tersedia' }}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol :lg="6">
            <CCard class="mb-3">
              <CCardBody>
                <CCardText>
                  <strong>Lokasi:</strong> {{ asetData.outletName || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Area:</strong> {{ asetData.areaName || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Posisi Aset/Perkap:</strong> {{ asetData.positionName || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Nama Aset:</strong> {{ asetData.assetName || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Merk Aset:</strong> {{ asetData.assetBrand || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Kondisi Awal Aset:</strong> {{ asetData.assetCondition || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Tanggal Pembelian Aset:</strong> {{ asetData.assetPurchaseDate || 'Tidak tersedia' }}
                </CCardText>

                <CCardText>
                  <strong>Usia Aset (Bulan):</strong> {{ asetData.assetAge || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Status Aset:</strong> {{ asetData.assetStatus || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>PIC Aset:</strong> {{ asetData.assetPicName || 'Tidak tersedia' }}
                </CCardText>
                <CCardText>
                  <strong>Penanggung Jawab Aset:</strong> {{ asetData.personalResponsible || 'Tidak tersedia' }}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>

        </CRow>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { ref, onMounted } from 'vue';
import QRCode from 'qrcode';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;
export default {
  name: 'AssetQRGenerator',
  data() {
    return {
      asetData: {
        aset_id: "",
        assetName: "",
        assetBrand: "",
        assetCondition: "",
        assetSpecification: "",
        assetImage: "",
        defaultImage: "https://png.pngtree.com/thumb_back/fw800/background/20220128/pngtree-internet-network-warning-404-error-page-or-file-not-found-for-image_984725.jpg",
        outletName: "",
        areaName: "",
        assetStatus: "",
        deprecationValue: "",
        classificationAcquisitionValue: "",
        assetPurchaseDate: "",
        classificationLastBookValue: "",
        assetPicName: "",
        personalResponsible: "",
        assetAge: "",
        positionName:"",
      },
    };
  },
  mounted() {
    console.log("Aset ID from route:", this.$route.params.id);
    this.asetData.aset_id = this.$route.params.id;
    if (this.asetData.aset_id) {
      this.fetchAsetData(this.asetData.aset_id);
    } else {
      console.error("No valid asset ID found in the URL.");
    }
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.generateQRCode);
  },

  methods: {
    fetchAsetData(asetId) {
      const token = localStorage.getItem("token");
      axios
        .get(`${apiUrl}/api/assets/${asetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const aset = response.data.data;
          const baseURL = apiUrl;

          this.asetData = {
            ...this.asetData,
            assetIdHash: aset.assetIdHash || "Tidak tersedia",
            assetName: aset.assetName || "Tidak tersedia",
            assetBrand: aset.assetBrand || "Tidak tersedia",
            assetCondition: aset.assetCondition || "Tidak tersedia",
            assetSpecification: aset.assetSpecification || "Tidak tersedia",
            assetImage: `${baseURL}${aset.assetImage}` || this.asetData.defaultImage,
            outletName: aset.outletName || "Tidak tersedia",
            areaName: aset.areaName || "Tidak tersedia",
            assetStatus: aset.assetStatus || "Tidak tersedia",
            assetAge: aset.assetAge || "Tidak tersedia",
            positionName: aset.positionName || "Tidak tersedia",
            deprecationValue: aset.deprecationValue || "Tidak tersedia",
            classificationAcquisitionValue: aset.classificationAcquisitionValue || "Tidak tersedia",
            classificationLastBookValue: aset.classificationLastBookValue || "Tidak tersedia",
            assetPicName: aset.assetPicName || "Tidak tersedia",
            assetPurchaseDate: aset.assetPurchaseDate
              ? new Date(aset.assetPurchaseDate).toLocaleDateString()
              : "Tidak tersedia",
            personalResponsible: aset.personalResponsible || "Tidak tersedia",
          };
          this.generateQRCode();
        })
        .catch((error) => {
          console.error("Gagal mengambil data aset:", error);
        });
    },


    generateQRCode() {
      const canvasEl = this.$refs.qrcode;
      const assetName = this.asetData.assetName; // Nama aset untuk overlay
      const qrContent = `${this.asetData.assetIdHash}&`; // Tambahkan "&" setelah assetIdHash

      if (canvasEl && this.asetData.assetIdHash) {
        // Generate QR Code dengan tambahan "&"
        QRCode.toCanvas(
          canvasEl,
          qrContent,
          {
            width: 300,
            margin: 2,
          },
          (error) => {
            if (error) {
              console.error("QR Code Error:", error);
              return;
            }

            // Overlay the asset name in the middle of the QR code
            const ctx = canvasEl.getContext("2d");
            const canvasWidth = canvasEl.width;
            const canvasHeight = canvasEl.height;

            ctx.font = "bold 20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";

            // Add background behind the text (optional)
            const textWidth = ctx.measureText(assetName).width;
            const textHeight = 20; // Approximate text height
            ctx.fillStyle = "white";
            ctx.fillRect(
              (canvasWidth - textWidth) / 2 - 5,
              (canvasHeight - textHeight) / 2 - 5,
              textWidth + 10,
              textHeight + 10
            );

            // Add the text
            ctx.fillStyle = "black";
            ctx.fillText(assetName, canvasWidth / 2, canvasHeight / 2);
          }
        );
      } else {
        console.error("Canvas element or assetIdHash is not available.");
      }
    },




    downloadQRCode() {
      const qrCodeElement = this.$refs.qrcode;
      if (!qrCodeElement) {
        alert('QR Code belum dihasilkan.');
        return;
      }
      const link = document.createElement('a');
      link.href = qrCodeElement.toDataURL();
      link.download = `qr_${this.asetData.assetName || 'unknown'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
