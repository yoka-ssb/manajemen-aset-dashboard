<template>
    <CCol :xs="12">
        <CCard class="mb-4">
            <CCardHeader>
                <strong>Detail Aset</strong>
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol class="text-center" v-if="loading">
                        <CSpinner color="primary" size="lg" class="my-5" />
                    </CCol>
                    <CCol v-else>
                        <CRow>
                            <CCol :lg="6">
                                <CCard class="mb-3">
                                    <CCardImage orientation="top" :src="assetImage ? assetImage : defaultImage" />
                                    <CCardBody>
                                        <strong>Spesifikasi Aset/Perkap :</strong>
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
                                            <strong>Nama Aset/Perkap :</strong> {{ assetName || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>Merk Aset/Perkap :</strong> {{ assetBrand || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>Kondisi Awal Aset/Perkap :</strong> {{ assetCondition || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>Tanggal Pembelian Aset/Perkap :</strong> {{ assetPurchaseDate || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>Usia Aset/Perkap (Bulan):</strong> {{ assetAge || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>Status Aset/Perkap :</strong> {{ assetStatus || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>PIC Aset/Perkap :</strong> {{ assetPicName || 'Tidak tersedia' }}
                                        </CCardText>
                                        <CCardText>
                                            <strong>Penanggung Jawab Aset/Perkap :</strong> {{ personalResponsible || 'Tidak tersedia' }}
                                        </CCardText>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol class="text-end mt-3">
                                <button class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 mr-2"
                                    @click="navigateToParameterAset">
                                    Maintenance Aset
                                </button>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    </CCol>
</template>


<script>
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;
export default {
    data() {
        return {
            IdHash: this.$route.params.IdHash || '',
            assetMaintenanceDate: "",
            assetId: "",
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
        this.fetchAsetData(this.IdHash);
    },
    methods: {
        fetchAsetData(IdHash) {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/assets/hash", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { hash_id: IdHash },
                })
                .then((response) => {
                    const aset = response.data.data;
                    this.assetName = aset.assetName || "Tidak tersedia";
                    this.assetId = aset.assetId || "Tidak tersedia";
                    this.assetBrand = aset.assetBrand || "Tidak tersedia";
                    this.assetCondition = aset.assetCondition || "Tidak tersedia";
                    this.assetSpecification = aset.assetSpecification || "Tidak tersedia";
                    const assetImagePath = aset.assetImage || this.defaultImage;
// const apiKey = "bprfjocmaqfib592338vf"; // Ganti dengan API key yang sesuai

// Encode assetImagePath untuk memastikan URL aman
const encodedAssetImagePath = encodeURIComponent(aset.assetImage || this.defaultImage);
console.log("Encoded assetImagePath:", encodedAssetImagePath);

axios
  .get(`${apiUrl}/api/get-file?path=${encodedAssetImagePath}`, {
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
                    this.assetClassification = aset.assetClassification || "Tidak tersedia";
                })
                .catch((error) => {
                    console.error("Gagal mengambil data aset:", error);
                });
        },

        navigateToParameterAset() {
            this.$router.push({
                name: "ParameterAset",
                params: { id: this.assetId, idklasifikasi: this.assetClassification }
            });
        },
    },
};
</script>
