<template>
  <CCol :xs="12">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Detail Aset/Perkap</strong>
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
                  <CCardImage orientation="top" :src="assetImage ? assetImage : defaultImage" alt="Gambar aset" />
                  <CCardBody>
                    <strong>Spesifikasi Aset/Perkap :</strong>
                    <CCardText>
                      {{ assetSpecification || 'Tidak tersedia' }}
                    </CCardText>
                    <strong>Jumlah Standard Asset/Perkap :</strong>
                    <CCardText>
                      {{ assetQuantityStandard || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Posisi Aset/Perkap:</strong> {{ positionName || 'Tidak tersedia' }}
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
                      <strong>Nama Aset/Perkap:</strong> {{ assetName || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Merk Aset/Perkap:</strong> {{ assetBrand || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Kondisi Awal Aset/Perkap:</strong> {{ assetCondition || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Tanggal Pembelian Aset/Perkap:</strong> {{ assetPurchaseDate || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Usia Aset/Perkap (Bulan):</strong> {{ assetAge || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Tanggal Maintenance Aset/Perkap:</strong> {{ assetMaintenanceDate || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Status Aset/Perkap:</strong> {{ assetStatus || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>PIC Aset/Perkap:</strong> {{ assetPicName || 'Tidak tersedia' }}
                    </CCardText>
                    <CCardText>
                      <strong>Penanggung Jawab Aset/Perkap:</strong> {{ personalResponsible || 'Tidak tersedia' }}
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-end mt-3">
                <button v-if="assetStatus && assetStatus.toLowerCase() === 'baik'"
                  class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" @click="navigateToFromAset">
                  Laporkan Kondisi Aset/Perkap
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
      loading: false,
      assetQuantityStandard: "",
    };
  },
  created() {
    this.fetchAsetData(this.asetId);
  },
  methods: {
    fetchAsetData(asetId) {
      this.loading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`${apiUrl}/api/assets/${asetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const aset = response.data.data;

          this.assetName = aset.assetName || "Tidak tersedia";
          this.assetBrand = aset.assetBrand || "Tidak tersedia";
          this.assetCondition = aset.assetCondition || "Tidak tersedia";
          this.assetSpecification = aset.assetSpecification || "Tidak tersedia";
          const assetImagePath = aset.assetImage || this.defaultImage;

          const encodedAssetImagePath = encodeURIComponent(aset.assetImage || this.defaultImage);
          console.log("Encoded assetImagePath:", encodedAssetImagePath);

          axios
            .get(`${uploadUrl}/get-file?path=${encodedAssetImagePath}`, {
              headers: { 'X-API-KEY': 'bprfjocmaqfib592338vf' },
              responseType: 'arraybuffer',
            })
            .then((response) => {
              console.log("Response from API:", response);
              const blob = new Blob([response.data], { type: 'image/jpeg' });
              this.assetImage = URL.createObjectURL(blob);
            })
            .catch((error) => {
              console.error("Gagal mengambil gambar:", error);
              this.assetImage = this.defaultImage;
            });
          this.outletName = aset.outletName || "Tidak tersedia";
          this.positionName = aset.positionName || "TIdak tersedia";
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
          this.assetQuantityStandard = aset.assetQuantityStandard || "Tidak tersedia";
        })
        .catch((error) => {
          console.error("Gagal mengambil data aset:", error.message);
        })
        .finally(() => {
          this.loading = false;
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