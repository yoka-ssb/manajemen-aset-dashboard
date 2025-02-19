<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <input v-model="searchSubmission" @input="debouncedSearch" type="text" placeholder="Cari Nama Pengaju..."
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
                        <CTableDataCell>{{ submission.submissionName }}</CTableDataCell>
                        <CTableDataCell>{{ submission.submissionCategory }}</CTableDataCell>
                        <CTableDataCell>{{ formatDate(submission.submissionDate) }}</CTableDataCell>
                        <CTableDataCell>{{ submission.submissionOutlet }}</CTableDataCell>
                        <CTableDataCell>{{ submission.submissionArea }}</CTableDataCell>
                        <CTableDataCell>{{ submission.submissionStatus }}</CTableDataCell>
                        <CTableDataCell>
                            <div class="flex space-x-2">
                                <button @click="DetailPengajuan(submission.submissionId)"
                                    class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">View
                                    Detail</button>
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
        };
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

                const response = await axios.get(`${apiUrl}/api/submissions`, {
                    params: {
                        page_number: this.page,
                        page_size: this.pageSize,
                        q: this.searchSubmission,
                        role_id: this.role_id,
                        area_id: this.area_id,
                        outlet_id: this.outlet_id,
                    },
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
</style>