<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <input type="text" placeholder="Cari Kategori Pengajuan..."
                class="px-4 py-2 border rounded-lg" />
        </div>
        <div class="overflow-x-auto rounded-lg border border-gray-200">
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Kategori</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Area Kerja</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tanggal Pengajuan</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="(request, index) in requests" :key="request.permintaan_id">
                        <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                        <CTableDataCell>{{ request.permintaan_kategori }}</CTableDataCell>
                        <CTableDataCell>{{ request.outlet_name }}</CTableDataCell>
                        <CTableDataCell>{{ formatDate(request.permintaan_tgl_pengajuan) }}</CTableDataCell>
                        <CTableDataCell>{{ request.permintaan_status }}</CTableDataCell>
                        <CTableDataCell>
                            <div class="flex space-x-2">
                                <button class="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">View</button>
                                <button class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">Download</button>
                            </div>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            requests: [],
            searchAsets: ''
        };
    },
    mounted() {
        this.fetchRequest();
    },
    methods: {
        async fetchRequest() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/request/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.requests = response.data.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, options);
        },
    },
};
</script>
