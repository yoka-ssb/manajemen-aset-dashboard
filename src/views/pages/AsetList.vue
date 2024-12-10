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
                        <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                        <CTableDataCell>{{ asset.assetName }}</CTableDataCell>
                        <CTableDataCell>{{ asset.assetBrand }}</CTableDataCell>
                        <CTableDataCell>{{ asset.outletName }}</CTableDataCell>
                        <CTableDataCell>{{ asset.areaName }}</CTableDataCell>
                        <CTableDataCell>{{ new Date(asset.assetMaintenanceDate).toLocaleDateString('id-ID') }}</CTableDataCell>
                        <CTableDataCell>{{ asset.assetStatus }}</CTableDataCell>
                        <CTableDataCell>
                            <div class="flex space-x-2">
                                <button @click="ViewAsetUser(asset.assetId)"
                                    class="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">View</button>
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
        <span>Page {{ page }} </span>
        <button @click="changePage(page + 1)" :disabled="page === totalPages"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
          Next
        </button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

export default {
    data() {
        return {
            searchAssets: "",
        assets: [],
        page: 1,
        totalPages: 1,
        totalAssets: 0,
        sortOrder: 'asc',
        };
    },
    mounted() {
        this.fetchAssets();
    },
    methods: {
        ViewAsetUser(assetId) {
            this.$router.push({ name: "ViewAsetUser", params: { id: assetId } });
            console.log("View asset with ID:", assetId);
        },
       
        async fetchAssets() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found in local storage.");
            return;
          }
  
          const response = await axios.get("http://localhost:8080/api/assets", {
            params: {
              page_number: this.page, 
              page_size: 10, 
              q: this.searchAssets,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          this.assets = response.data.data;
          this.totalAssets = response.data.total;
          this.totalPages = Math.ceil(this.totalAssets / 10);
        } catch (error) {
          console.error("Error fetching assets:", error);
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