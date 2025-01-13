<template>
  <CCol :xs="12">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Parameter Kesehatan Aset</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol class="text-center" v-if="loading">
            <CSpinner color="primary" size="lg" class="my-5" />
          </CCol>
          <CCol v-else :lg="12">
            <CCard class="mb-3">
              <CCardBody>
                <strong>Pastikan Aset memenuhi beberapa kondisi berikut:</strong>
                <CCardText v-if="parameter_kesehatan_aset.length">
                  <ul>
                    <li v-for="(param, index) in parameter_kesehatan_aset" :key="index">
                      {{ param }}
                    </li>
                  </ul>
                </CCardText>
                <CCardText v-else>
                  Tidak tersedia
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol class="text-end mt-3">
            <button
              @click="updateAsetStatus('Baik')"
              class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 mr-2"
            >
              Kondisi Baik
            </button>
            <button
              @click="showConfirmationModalKKB"
              class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Kondisi Kurang Baik
            </button>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </CCol>

  <!-- Modal Konfirmasi untuk Kondisi Kurang Baik -->
  <CModal :visible="showModal" @close="closeModal" size="m">
    <CModalHeader>
      <CModalTitle>Kondisi Aset Kurang Baik</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Pilih tindakan untuk aset dengan kondisi kurang baik
    </CModalBody>
    <CModalFooter>
      <button class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 mr-2" @click="abaikanService">
        Abaikan Kondisi Aset
      </button>
      <button class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" @click="ajukanService">
        Ajukan Service/Ganti
      </button>
    </CModalFooter>
  </CModal>
</template>

<script>
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  data() {
    return {
      klasifikasiId: this.$route.params.idklasifikasi,
      assetId: null,
      parameter_kesehatan_aset: [],
      showModal: false,
      loading: true, 
      token: localStorage.getItem("token"),
    };
  },
  created() {
    this.fetchClassificationData(this.klasifikasiId);
    const urlSegments = this.$route.path.split("/");
    this.assetId = urlSegments[urlSegments.length - 2];
    this.fetchClassificationData(this.klasifikasiId);
  },
  methods: {
    fetchClassificationData(klasifikasiId) {
      this.loading = true;
      axios
        .get(`${apiUrl}/api/classifications/${klasifikasiId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((response) => {
          const assetHealthyParam = response.data.data.assetHealthyParamMap.param_1;
          this.parameter_kesehatan_aset = assetHealthyParam
            ? assetHealthyParam.split("\n")
            : [];
        })
        .catch((error) => {
          console.error("Gagal mengambil data klasifikasi:", error);
        })
        .finally(() => {
          this.loading = false; 
        });
    },
    updateAsetStatus(status) {
      this.loading = true; 
      axios
        .put(
          `${apiUrl}/api/assets/${this.assetId}/status`,
          { asset_status: status },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        )
        .then(() => {
          this.$router.push("/pages/AsetList");
        })
        .catch((error) => {
          console.error("Gagal mengupdate status aset:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showConfirmationModalKKB() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.$router.push(`/pages/FormAset/${this.$route.params.assetId}`);
    },
    ajukanService() {
      this.closeModal();
      this.$router.push(`/pages/FormAset/${this.assetId}`);
    },
    abaikanService() {
      this.closeModal();
      this.$router.push(`/pages/FormAset/${this.assetId}`);
    },
  },
};
</script>
