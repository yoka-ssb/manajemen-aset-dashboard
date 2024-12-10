<template>
    <CCol :xs="12">
        <CCard class="mb-4">
            <CCardHeader>
                <strong>Detail Aset</strong>
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol :lg="6">
                        <CCard class="mb-3">
                            <CCardImage orientation="top" :src="assetImage ? assetImage : defaultImage" />
                            <CCardBody>
                                <strong>Spesifikasi Aset:</strong>
                                <CCardText>
                                    {{ assetSpecification || 'Tidak tersedia' }}
                                </CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol :lg="6">
                        <CCard class="mb-3">
                            <CCardBody>
                                <CCardText>
                                    <strong>Lokasi:</strong> {{ outletName || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Area:</strong> {{ areaName || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Nama Aset:</strong> {{ assetName || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Merk Aset:</strong> {{ assetBrand || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Kondisi Awal Aset:</strong> {{ assetCondition || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Tanggal Pembelian Aset:</strong> {{ assetPurchaseDate || 'Tidak tersedia'}}
                                </CCardText>
                                <CCardText>
                                    <strong>Usia Aset (Bulan):</strong> {{ assetAge || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Tanggal Maintenance Aset:</strong> {{ assetMaintenanceDate || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Status Aset:</strong> {{ assetStatus || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>PIC Aset:</strong> {{ assetPicName || 'Tidak tersedia' }}
                                </CCardText>
                                <CCardText>
                                    <strong>Penanggung Jawab Aset:</strong> {{ personalResponsible || 'Tidak tersedia' }}
                                </CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol class="text-end mt-3">
                        <button class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        @click="navigateToFromAset">
                            Laporkan Barang Hilang
                        </button>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    </CCol>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      asetId: this.$route.params.id,
      assetMaintenanceDate: "",
      assetName: "",
      assetBrand: "",
      assetCondition: "",
      assetSpecification: "",
      assetImage: "",
      defaultImage: "https://png.pngtree.com/thumb_back/fw800/background/20220128/pngtree-internet-network-warning-404-error-page-or-file-not-found-for-image_984725.jpg",
      outletName: "",
      areaName: "",
      assetStatus: "",
      assetPurchaseDate: "",
      assetPicName: "",
      personalResponsible: "",
      assetAge: "",
      assetClassification: "", 
    };
  },
  created() {
    this.fetchAsetData(this.asetId);
  },
  methods: {
    fetchAsetData(asetId) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:8080/api/assets/${asetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const aset = response.data.data;

          this.assetName = aset.assetName || "Tidak tersedia";
          
          this.assetBrand = aset.assetBrand || "Tidak tersedia";
          this.assetCondition = aset.assetCondition || "Tidak tersedia";
          this.assetSpecification = aset.assetSpecification || "Tidak tersedia";
          const assetImagePath = aset.assetImage || this.defaultImage;
// const apiKey = "bprfjocmaqfib592338vf"; // Ganti dengan API key yang sesuai

// Encode assetImagePath untuk memastikan URL aman
const encodedAssetImagePath = encodeURIComponent(aset.assetImage || this.defaultImage);
console.log("Encoded assetImagePath:", encodedAssetImagePath);

axios
  .get(`http://localhost:8081/get-file?path=${encodedAssetImagePath}`, {
    headers: { 'X-API-KEY': 'bprfjocmaqfib592338vf' },
    responseType: 'arraybuffer', // Penting: Pastikan menerima data sebagai array buffer
  })
  .then((response) => {
    console.log("Response from API:", response);
    const blob = new Blob([response.data], { type: 'image/jpeg' }); // Pastikan MIME type sesuai
    this.assetImage = URL.createObjectURL(blob); // Buat URL blob untuk digunakan sebagai src
  })
  .catch((error) => {
    console.error("Gagal mengambil gambar:", error);
    this.assetImage = this.defaultImage; // Fallback jika terjadi error
  });
          this.outletName = aset.outletName || "Tidak tersedia";
          this.areaName = aset.areaName || "Tidak tersedia";
          this.assetStatus = aset.assetStatus || "Tidak tersedia";
          this.assetAge = aset.assetAge || "Tidak tersedia";
          this.assetPicName = aset.assetPicName || "Tidak tersedia";
          this.assetPurchaseDate = aset.assetPurchaseDate
            ? new Date(aset.assetPurchaseDate).toLocaleDateString()
            : "Tidak tersedia";

            this.assetMaintenanceDate = aset.assetMaintenanceDate
            ? new Date(aset.assetMaintenanceDate).toLocaleDateString()
            : "Tidak tersedia";
          this.personalResponsible = aset.personalResponsible || "Tidak tersedia";
          this.assetClassification = aset.assetClassification || "Tidak tersedia"; // Simpan assetClassification
        })
        .catch((error) => {
          console.error("Gagal mengambil data aset:", error);
        });
    },
        navigateToParameterAset() {
    this.$router.push({
      name: "ParameterAset",
      params: { id: this.asetId, idklasifikasi: this.assetClassification },
    });
  },
    navigateToFromAset() {
      this.$router.push({ name: "FormAset", params: { id: this.asetId } });
    },
  },
};
</script>
