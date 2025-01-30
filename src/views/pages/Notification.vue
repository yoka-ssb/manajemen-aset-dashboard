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
                    <li v-for="item in nearestMaintenance" :key="item.id">
                      - Asset {{ item.assetName }} harus dimaintenance pada {{ formatDate(item.maintenanceOrSubmitted)
                      }}
                      <router-link to="/pages/ScanQr" class="hover:underline text-blue-500 cursor-pointer">
                        maintenance sekarang
                      </router-link>
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

        <!-- Konten Jadwal Maintenance Submitted -->
        <CRow>
          <CCol v-if="!loading && (role_id !== 5 && role_id !== 6)" :lg="12">
            <CCard class="mb-3">
              <CCardHeader>
                <strong>Pengajuan</strong>
              </CCardHeader>
              <CCardBody>
                <CCardText v-if="submittedMaintenance.length">
                  <ul>
                    <li v-for="item in submittedMaintenance" :key="item.id">
                      - Asset {{ item.assetName }} diajukan untuk maintenance pada {{
                        formatDate(item.maintenanceOrSubmitted) }}
                      <router-link to="/pages/ListPengajuan" class="hover:underline text-blue-500 cursor-pointer">
                        lihat detail
                      </router-link>
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
                    <li v-for="item in overdueMaintenance" :key="item.id">
                      - Asset {{ item.assetName }} terlambat sejak {{ formatDate(item.maintenanceOrSubmitted) }}
                      <router-link to="/pages/ScanQr" class="hover:underline text-blue-500 cursor-pointer">
                        maintenance sekarang
                      </router-link>
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

      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { ref } from 'vue'; // Import 'ref' from Vue
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
          .filter((item) => item.status !== 'late' && item.status !== 'submitted') // Notifikasi selain late dan submitted
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
      } catch (error) {
        console.error("Gagal memuat data:", error);
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
    }
  },
  mounted() {
    this.fetchNotifications();
  },
};
</script>
