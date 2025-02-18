<template>
  <CCol :xs="12">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Notifikasi</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <!-- Spinner untuk Loading -->
          <CCol class="text-center" v-if="loading">
            <CSpinner color="primary" size="lg" class="my-5" />
          </CCol>

          <!-- Konten Jadwal Maintenance Terdekat -->
          <CCol v-else :lg="12">
            <CCard class="mb-3">
              <CCardHeader>
                <strong>Jadwal Maintenance Terdekat</strong>
              </CCardHeader>
              <CCardBody>
                <CCardText v-if="nearestMaintenance.length">
                  <ul>
                    <li v-for="item in nearestMaintenance" :key="item.id" class="mb-4">
                      <CCard class="mb-3">
                        <CCardBody class="d-flex justify-content-between align-items-center">
                          <span>- Asset {{ item.assetName }} harus dimaintenance pada {{ formatDate(item.maintenanceOrSubmitted) }}</span>
                          <router-link to="/pages/ScanQr">
                            <button class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 ml-2">
                              Maintenance Sekarang
                            </button>
                          </router-link>
                        </CCardBody>
                      </CCard>
                    </li>
                  </ul>
                </CCardText>
                <CCardText v-else>
                  Tidak tersedia
                </CCardText>
                <div v-if="nearestMaintenance.length && totalPages.nearest > 1" class="pagination">
                  <button @click="prevPage('nearest')" :disabled="pageNumber.nearest === 1">Previous</button>
                  <span>Page {{ pageNumber.nearest }} of {{ totalPages.nearest }}</span>
                  <button @click="nextPage('nearest')" :disabled="pageNumber.nearest === totalPages.nearest">Next</button>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <!-- Konten Jadwal Maintenance Submitted -->
        <CRow v-if="!loading && role_id !== 6">
          <CCol :lg="12">
            <CCard class="mb-3">
              <CCardHeader>
                <strong>Pengajuan</strong>
              </CCardHeader>
              <CCardBody>
                <CCardText v-if="submittedMaintenance.length">
                  <ul>
                    <li v-for="item in submittedMaintenance" :key="item.id" class="mb-4">
                      <CCard class="mb-3">
                        <CCardBody class="d-flex justify-content-between align-items-center">
                          <span>- Asset {{ item.assetName }} dilakukan pengajuan pada {{ formatDate(item.maintenanceOrSubmitted) }}</span>
                          <router-link to="/pages/ListPengajuan">
                            <button class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 ml-2">
                              Lihat Detail
                            </button>
                          </router-link>
                        </CCardBody>
                      </CCard>
                    </li>
                  </ul>
                </CCardText>
                <CCardText v-else>
                  Tidak tersedia
                </CCardText>
                <div v-if="submittedMaintenance.length && totalPages.submitted > 1" class="pagination">
                  <button @click="prevPage('submitted')" :disabled="pageNumber.submitted === 1">Previous</button>
                  <span>Page {{ pageNumber.submitted }} of {{ totalPages.submitted }}</span>
                  <button @click="nextPage('submitted')" :disabled="pageNumber.submitted === totalPages.submitted">Next</button>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <!-- Konten Jadwal Maintenance Terlambat -->
        <CRow>
          <CCol v-if="!loading" :lg="12">
            <CCard class="mb-3">
              <CCardHeader>
                <strong>Jadwal Maintenance Terlambat</strong>
              </CCardHeader>
              <CCardBody>
                <CCardText v-if="overdueMaintenance.length">
                  <ul>
                    <li v-for="item in overdueMaintenance" :key="item.id" class="mb-4">
                      <CCard class="mb-3">
                        <CCardBody class="d-flex justify-content-between align-items-center">
                          <span>- Asset {{ item.assetName }} terlambat sejak {{ formatDate(item.maintenanceOrSubmitted) }}</span>
                          <router-link to="/pages/ScanQr">
                            <button class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 ml-2">
                              Maintenance Sekarang
                            </button>
                          </router-link>
                        </CCardBody>
                      </CCard>
                    </li>
                  </ul>
                </CCardText>
                <CCardText v-else>
                  Tidak tersedia
                </CCardText>
                <div v-if="overdueMaintenance.length && totalPages.overdue > 1" class="pagination">
                  <button @click="prevPage('overdue')" :disabled="pageNumber.overdue === 1">Previous</button>
                  <span>Page {{ pageNumber.overdue }} of {{ totalPages.overdue }}</span>
                  <button @click="nextPage('overdue')" :disabled="pageNumber.overdue === totalPages.overdue">Next</button>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { ref } from 'vue'; 
import axios from "axios";
import jwt_decode from "jwt-decode";
const apiUrl = import.meta.env.VITE_API_URL;

const outlet_id = ref(null);
const area_id = ref(null);
const role_id = ref(null);

const parseToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwt_decode(token);
    outlet_id.value = decoded.outlet_id;
    area_id.value = decoded.area_id;
    role_id.value = decoded.role_id;
    console.log('Outlet ID:', outlet_id.value);
    console.log('Area ID:', area_id.value);
    console.log('Role ID:', role_id.value);
  } else {
    console.error('Token not found in local storage');
  }
};

export default {
  data() {
    return {
      loading: true,
      nearestMaintenance: [],
      overdueMaintenance: [],
      submittedMaintenance: [],
      pageNumber: {
        nearest: 1,
        overdue: 1,
        submitted: 1,
      },
      totalPages: {
        nearest: 1,
        overdue: 1,
        submitted: 1,
      },
    };
  },
  methods: {
    async fetchNotifications() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        parseToken();

        let params = {
          role_id: role_id.value,
          page: this.pageNumber.nearest,
          pageSize: 10,
        };

        // Kondisi untuk role_id selain 5 dan 6
        if (role_id.value !== 5 && role_id.value !== 6) {
          // Jika role_id bukan 5 atau 6, tidak perlu menambahkan area_id atau outlet_id
          // Cukup dengan role_id saja
        } else if (role_id.value === 5) {
          // Untuk role_id 5, kirim role_id dan area_id
          params = { ...params, area_id: area_id.value };
        } else if (role_id.value === 6) {
          // Untuk role_id 6, kirim role_id dan outlet_id
          params = { ...params, outlet_id: outlet_id.value };
        }

        // Kirim request dengan parameter yang sudah diperbarui
        const response = await axios.get(`${apiUrl}/api/notifications`, {
          params: params,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const notifications = response.data.data;

        // Pisahkan notifikasi berdasarkan status
        this.nearestMaintenance = notifications
          .filter((item) => item.status === 'waiting') // Notifikasi dengan status waiting
          .map((item) => ({
            id: item.idNotification,
            assetName: item.assetName,
            maintenanceOrSubmitted: item.maintenanceOrSubmitted,
          }));

        this.overdueMaintenance = notifications
          .filter((item) => item.status === 'late')
          .map((item) => ({
            id: item.idNotification,
            assetName: item.assetName,
            maintenanceOrSubmitted: item.maintenanceOrSubmitted,
          }));

        this.submittedMaintenance = notifications
          .filter((item) => item.status === 'submitted')
          .map((item) => ({
            id: item.idNotification,
            assetName: item.assetName,
            maintenanceOrSubmitted: item.maintenanceOrSubmitted,
          }));

        // Update total pages
        this.totalPages.nearest = Math.ceil(response.data.totalWaiting / 10);
        this.totalPages.overdue = Math.ceil(response.data.totalLate / 10);
        this.totalPages.submitted = Math.ceil(response.data.totalSubmitted / 10);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          this.$router.push({ name: 'Login' });
        } else {
          console.error("gagal:", error);
        }
      } finally {
        this.loading = false;
      }
    },
    // Metode untuk memformat tanggal
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    },
    nextPage(type) {
      if (this.pageNumber[type] < this.totalPages[type]) {
        this.pageNumber[type]++;
        this.fetchNotifications();
      }
    },
    prevPage(type) {
      if (this.pageNumber[type] > 1) {
        this.pageNumber[type]--;
        this.fetchNotifications();
      }
    }
  },
  mounted() {
    this.fetchNotifications();
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}
.pagination button {
  background-color: #f0ad4e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
</style>