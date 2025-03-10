<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <button @click="$router.push({ name: 'AddAset' })"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14" />
        </svg>
        Tambah Aset
      </button>
      <input v-model="searchAssets" @input="debouncedSearch" type="text" placeholder="Cari Aset..."
        class="px-4 py-2 border rounded-lg" />
    </div>

    <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Nama Aset</CTableHeaderCell>
            <CTableHeaderCell scope="col">Merk</CTableHeaderCell>
            <CTableHeaderCell scope="col">Lokasi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Area</CTableHeaderCell>
            <CTableHeaderCell scope="col">Jadwal Perawatan</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          <CTableRow v-for="(asset, index) in assets" :key="asset.assetId">
            <CTableHeaderCell scope="row">{{ (page - 1) * pageSize + index + 1 }}</CTableHeaderCell>
            <CTableDataCell>{{ asset.assetName }}</CTableDataCell>
            <CTableDataCell>{{ asset.assetBrand }}</CTableDataCell>
            <CTableDataCell>{{ asset.outletName }}</CTableDataCell>
            <CTableDataCell>{{ asset.areaName }}</CTableDataCell>
            <CTableDataCell>{{ new Date(asset.assetMaintenanceDate).toLocaleDateString('id-ID') }}</CTableDataCell>
            <CTableDataCell>{{ asset.assetStatus }}</CTableDataCell>
            <CTableDataCell>
              <div class="flex space-x-2">
                <button @click="ViewAset(asset.assetId)"
                  class="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">View</button>
                <button @click="updateAset(asset.assetId)"
                  class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">Update</button>
                <button @click="QrGenerate(asset.assetId)"
                  class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">QR Generate</button>
              </div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <button @click="changePage(page - 1)" :disabled="page === 1"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
        Prev
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="changePage(page + 1)" :disabled="page === totalPages"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
        Next
      </button>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { debounce } from 'lodash';

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  data() {
    return {
      searchAssets: "",
      assets: [],
      page: 1,
      totalPages: 1,
      totalAssets: 0,
      pageSize: 10,
      loading: false,
    };
  },
  mounted() {
    this.fetchAssets();
  },
  methods: {
    ViewAset(assetId) {
      this.$router.push({ name: 'ViewAset', params: { id: assetId } });
      console.log("view aset with ID:", assetId);
    },
    updateAset(assetId) {
      this.$router.push({ name: 'updateAset', params: { id: assetId } });
      console.log("update aset with ID:", assetId);
    },
    QrGenerate(assetId) {
      this.$router.push({ name: 'QrGenerate', params: { id: assetId } });
      console.log("qr generate aset with ID:", assetId);
    },
    async fetchAssets() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }

        const response = await axios.get(apiUrl + "/api/assets", {
          params: {
            page_number: this.page, 
            page_size: this.pageSize, 
            q: this.searchAssets, 
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.assets = response.data.data;
        this.totalAssets = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalAssets / this.pageSize);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          this.$router.push({ name: 'Login' });
        } else {
          console.error("Error fetching assets:", error);
        }
      } finally {
        this.loading = false;
      }
    },
    changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return;
      this.page = newPage;
      this.fetchAssets(); 
    },
    debouncedSearch: debounce(function () {
      this.page = 1;
      this.fetchAssets();
    }, 500),
  },
  watch: {
    page() {
      this.fetchAssets();
    },
  },
};
</script>

<style scoped>
.loading-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.spinner {
border: 4px solid rgba(255, 255, 255, 0.3);
border-top: 4px solid white;
border-radius: 50%;
width: 50px;
height: 50px;
animation: spin 1s linear infinite;
}

@keyframes spin {
to {
  transform: rotate(360deg);
}
}
</style>