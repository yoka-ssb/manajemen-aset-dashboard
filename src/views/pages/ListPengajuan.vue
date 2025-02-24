<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <input v-if="view === 'satuan'" v-model="searchSubmission" @input="debouncedSearch" type="text" placeholder="Cari Nama Pengaju..."
                class="px-4 py-2 border rounded-lg" />
            <div class="flex space-x-2">
                <button v-if="view === 'satuan' && !showCheckboxes" @click="handlePilih" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    Pilih
                </button>
                <button v-if="view === 'satuan' && showCheckboxes && isAnySubmissionSelected" @click="handleSimpan" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Simpan
                </button>
                <button @click="toggleView('satuan')" :class="{'bg-blue-500': view === 'satuan', 'bg-gray-500': view !== 'satuan'}" class="text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Satuan
                </button>
                <button @click="toggleView('gabungan')" :class="{'bg-blue-500': view === 'gabungan', 'bg-gray-500': view !== 'gabungan'}" class="text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Gabungan
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
        </div>

        <transition name="slide-fade">
            <div v-if="view === 'gabungan'" class="overflow-x-auto rounded-lg border border-gray-200">
                <!-- Gabungan content here -->
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">No</CTableHeaderCell>
                            <CTableHeaderCell scope="col">ID Pengajuan</CTableHeaderCell>
                            <CTableHeaderCell scope="col">NIP</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Tanggal Pengajuan</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Lokasi</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Area</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow v-for="(submission, index) in submissions" :key="submission.submissionParentId">
                            <CTableHeaderCell scope="row">{{ (page - 1) * pageSize + index + 1 }}</CTableHeaderCell>
                            <CTableDataCell>P - {{ submission.submissionParentId }}</CTableDataCell>
                            <CTableDataCell>{{ submission.nip }}</CTableDataCell>
                            <CTableDataCell>{{ formatDate(submission.createdAt) }}</CTableDataCell>
                            <CTableDataCell>{{ submission.outletName }}</CTableDataCell>
                            <CTableDataCell>{{ submission.areaName }}</CTableDataCell>
                            <CTableDataCell>
                                <div class="flex space-x-2">
                                    <button @click="fetchSubmissionDetails(submission.submissionParentId)"
                                        class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">Lihat Detail</button>
                                </div>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </div>
        </transition>

        <transition name="slide-fade">
            <div v-if="view === 'satuan'" class="overflow-x-auto rounded-lg border border-gray-200">
                <!-- Satuan content here -->
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">No</CTableHeaderCell>
                            <CTableHeaderCell scope="col" v-if="showCheckboxes">Select</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Nama Pengaju</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Kategori</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Tanggal Pengajuan</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Lokasi</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Area</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow v-for="(submission, index) in submissions" :key="submission.submissionId">
                            <CTableHeaderCell scope="row">{{ (page - 1) * pageSize + index + 1 }}</CTableHeaderCell>
                            <CTableDataCell v-if="showCheckboxes"><input type="checkbox" v-model="selectedSubmissions" :value="submission.submissionId"></CTableDataCell>
                            <CTableDataCell>{{ submission.submissionName }}</CTableDataCell>
                            <CTableDataCell>{{ submission.submissionCategory }}</CTableDataCell>
                            <CTableDataCell>{{ formatDate(submission.submissionDate) }}</CTableDataCell>
                            <CTableDataCell>{{ submission.submissionOutlet }}</CTableDataCell>
                            <CTableDataCell>{{ submission.submissionArea }}</CTableDataCell>
                            <CTableDataCell>{{ submission.submissionStatus }}</CTableDataCell>
                            <CTableDataCell>
                                <div class="flex space-x-2">
                                    <button @click="DetailPengajuan(submission.submissionId)"
                                        class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">Lihat Detail</button>
                                </div>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </div>
        </transition>

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
import jwt_decode from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default {
    data() {
        return {
            searchSubmission: "",
            submissions: [],
            page: 1,
            totalPages: 1,
            totalSubmissions: 0,
            pageSize: 10,
            sortOrder: 'asc',
            nip: '',
            area_id: '',
            outlet_id: '',
            loading: false,
            view: 'satuan', 
            showCheckboxes: false,
            selectedSubmissions: [],
        };
    },

    computed: {
        isAnySubmissionSelected() {
            return this.selectedSubmissions.length > 0;
        }
    },

    methods: {
        async parseToken() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }
                const decoded = jwt_decode(token);
                if (decoded) {
                    this.role_id = decoded.role_id;
                    this.area_id = decoded.area_id;
                    this.outlet_id = decoded.outlet_id;
                    this.nip = decoded.sub;
                } else {
                    console.error('Invalid token format.');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        },

        DetailPengajuan(submissionId) {
            this.$router.push({ name: 'DetailPengajuan', params: { submissionId } });
        },

        async fetchSubmissions() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }

                const params = {
                    page_number: this.page,
                    page_size: this.pageSize,
                    q: this.searchSubmission,
                };

                let endpoint = `${apiUrl}/api/submissions`;
                if (this.view === 'gabungan') {
                    endpoint = `${apiUrl}/api/parents`;
                    params.nip = this.nip;
                } else {
                    params.parent_id = false; // Send parent_id as false for satuan
                    if (this.role_id === 5) {
                        params.area_id = this.area_id; // Send area_id for role_id 5
                    } else if (this.role_id === 6) {
                        params.outlet_id = this.outlet_id; // Send outlet_id for role_id 6
                    }
                }

                const response = await axios.get(endpoint, {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.submissions = response.data.data || [];
                this.totalSubmissions = response.data.totalCount || 0;
                this.totalPages = Math.ceil(this.totalSubmissions / this.pageSize);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'Login' });
                } else {
                    console.error("Error fetching submissions:", error);
                }
            } finally {
                this.loading = false;
            }
        },

        fetchSubmissionDetails(submissionParentId) {
            this.$router.push({ name: 'PengajuanGabungan', params: { submissionParentId } });
        },

        async handleSimpan() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }

                const payload = {
                    nip: String(this.nip),
                    submission_ids: this.selectedSubmissions,
                    outlet_id: this.outlet_id,
                    area_id: this.area_id
                };

                await axios.post(`${apiUrl}/api/parents`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Reset the selection and hide checkboxes
                this.selectedSubmissions = [];
                this.showCheckboxes = false;
                this.fetchSubmissions();
            } catch (error) {
                console.error("Error saving submissions:", error);
            }
        },

        changePage(newPage) {
            if (newPage >= 1 && newPage <= this.totalPages) {
                this.page = newPage;
                this.fetchSubmissions();
            }
        },

        debouncedSearch: debounce(function () {
            this.page = 1;
            this.fetchSubmissions();
        }, 500),

        formatDate(dateString) {
            if (!dateString) return "-";
            const date = new Date(dateString);
            if (isNaN(date)) return "-";
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },

        handlePilih() {
            this.showCheckboxes = !this.showCheckboxes;
        },

        toggleView(view) {
            this.view = view;
            this.showCheckboxes = false; // Hide checkboxes when switching views
            this.fetchSubmissions();
        }
    },

    async mounted() {
        await this.parseToken();
        this.fetchSubmissions();
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

.slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}
</style>