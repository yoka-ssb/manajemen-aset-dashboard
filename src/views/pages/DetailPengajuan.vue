<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Detail Pengajuan Aset</strong>
                </CCardHeader>
                <CCardBody>
                    <!-- Loading Spinner -->
                    <div v-if="isLoading" class="flex justify-center items-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <!-- Form Data -->
                    <div v-else>
                        <CForm>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex-1">
                                    <CFormLabel for="submissionDate">Tanggal Pengajuan</CFormLabel>
                                    <CFormInput id="submissionDate" v-model="submissionDate" type="text" placeholder="tanggal pengajuan auto value" readonly />
                                </div>
                                <div class="flex-1 ml-4">
                                    <CFormLabel for="submissionName">Nama Pengaju</CFormLabel>
                                    <CFormInput id="submissionName" v-model="submissionName" type="text"
                                        placeholder="nama pengaju auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex-1">
                                    <CFormLabel for="nip">NIP</CFormLabel>
                                    <CFormInput id="nip" v-model="nip" type="text" placeholder="NIP auto value" readonly />
                                </div>
                                <div class="flex-1 ml-4">
                                    <CFormLabel for="submissionDescription">Nama Penanggung Jawab Aset</CFormLabel>
                                    <CFormInput id="submissionDescription" v-model="submissionDescription" type="text"
                                        placeholder="nama penanggung jawab aset auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex-1">
                                    <CFormLabel for="submissionAssetName">Nama Aset</CFormLabel>
                                    <CFormInput id="submissionAssetName" v-model="submissionAssetName" type="text"
                                        placeholder="nama aset auto value" readonly />
                                </div>
                                <div class="flex-1 ml-4">
                                    <CFormLabel for="submissionRoleName">Nama PIC Aset</CFormLabel>
                                    <CFormInput id="submissionRoleName" v-model="submissionRoleName" type="text"
                                        placeholder="nama pic aset auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex justify-between">
                                <div class="flex-1 mr-4">
                                    <CFormLabel for="submissionCategory">Kategori Pengajuan</CFormLabel>
                                    <CFormInput id="submissionCategory" v-model="submissionCategory" type="text"
                                        placeholder="nama kategori pengajuan auto value" readonly />
                                </div>
                                <div class="flex-1">
                                    <CFormLabel for="submissionOutlet">Lokasi</CFormLabel>
                                    <CFormInput id="submissionOutlet" v-model="submissionOutlet" type="text"
                                        placeholder="lokasi auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3 flex space-x-4">
                                <div class="flex-1 mr-4">
                                    <CFormLabel for="submissionArea">Area</CFormLabel>
                                    <CFormInput id="submissionArea" v-model="submissionArea" type="text"
                                        placeholder="area auto value" readonly />
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="flex items-start">
                                    <!-- Image Section -->
                                    <div class="mr-4">
                                        <CFormLabel for="Image">Lampiran</CFormLabel>
                                        <div v-if="attachment">
                                            <img :src="attachment" alt="Lampiran Gambar" class="img-fluid" style="max-width: 400px; max-height: 400px;" />
                                        </div>
                                        <div v-else>
                                            <p>Tidak ada gambar</p>
                                        </div>
                                    </div>
                                    
                                    <!-- Description Section -->
                                    <div class="flex-1">
                                        <CFormLabel for="submissionDescription">Description</CFormLabel>
                                        <CFormTextarea id="submissionDescription" v-model="submissionDescription" placeholder="Deskripsi" readonly />
                                    </div>
                                </div>
                            </div>
                        </CForm>
                    </div>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
import axios from "axios";
import { apiBaseUrl, apiUploadUrl } from '../../plugins/env.js'

const apiUrl = apiBaseUrl;
const uploadUrl = apiUploadUrl;
export default {
    data() {
        return {
            isLoading: true, 
            submissionId: this.$route.params.submissionId,
            submissionAssetName: "",
            submissionOutlet: "",
            submissionDescription: "",
            submissionRoleName: "",
            submissionCategory: "",
            submissionName: "",
            submissionArea: "",
            nip: "",
            submissionDate: "",
            imageSubmission: "",
            defaultImage: "https://png.pngtree.com/thumb_back/fw800/background/20220128/pngtree-internet-network-warning-404-error-page-or-file-not-found-for-image_984725.jpg",
            attachment: "",
        };
    },

    mounted() {
        this.fetchSubmissionsData();
    },

    methods: {
        async fetchSubmissionsData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                this.isLoading = false;
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/submissions/${this.submissionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response Data:", response.data);

                if (response.status === 200 && response.data.submission) {
                    const submissionData = response.data.submission; 
                    this.submissionName = submissionData.submissionName || '';
                    this.submissionAssetName = submissionData.submissionAssetName || '';
                    this.submissionDescription = submissionData.submissionDescription || '';
                    this.submissionRoleName = submissionData.submissionRoleName || '';
                    this.submissionOutlet = submissionData.submissionOutlet || '';
                    this.submissionArea = submissionData.submissionArea || '';
                    this.nip = submissionData.nip || '';
                    this.submissionCategory = submissionData.submissionCategory || '';
                    const formattedDate = new Date(submissionData.submissionDate).toLocaleDateString();
                    this.submissionDate = formattedDate;
                    const attachment = submissionData.attachment || this.defaultImage;
                    const encodedSubmissionImagePath = encodeURIComponent(submissionData.attachment || this.defaultImage);
                    console.log("path:", encodedSubmissionImagePath);
                    axios.get(`${uploadUrl}/get-file?path=${encodedSubmissionImagePath}`, {
                        headers: { 'X-API-KEY': 'bprfjocmaqfib592338vf' },
                        responseType: 'arraybuffer',
                    })
                        .then((response) => {
                            console.log("response:", response);
                            const blob = new Blob([response.data], { type: 'image/jpeg' });
                            this.attachment = URL.createObjectURL(blob);
                        })
                        .catch((error) => {
                            console.error("Gagal mengambil gambar:", error);
                            this.attachment = this.defaultImage;
                        });
                } else {
                    console.error("Data submission tidak ditemukan atau request gagal.");
                }
            } catch (error) {
                console.error("Error fetching submissions data:", error);
            } finally {
                this.isLoading = false; 
            }
        }
    }
};
</script>
