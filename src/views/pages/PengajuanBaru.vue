<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Formulir Pengajuan Aset</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">
                        <div class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="submission_name">Nama Pengaju</CFormLabel>
                                <CFormInput id="submission_name" v-model="submission_name" type="text"
                                    placeholder="Masukkan nama pengaju" readonly />
                            </div>
                            <div class="flex-1 ml-4">
                                <CFormLabel for="nip">NIP</CFormLabel>
                                <CFormInput id="nip" v-model="nip" type="text" placeholder="Masukkan NIP" readonly />
                            </div>
                        </div>
                        <div class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="submission_pr_name">Penanggung Jawab Aset</CFormLabel>
                                <CFormInput id="submission_pr_name" v-model="submission_pr_name" type="text"
                                    placeholder="Masukkan nama penanggung jawab/Pengguna aset" />
                            </div>
                            <div class="flex-1 ml-4">
                                <CFormLabel for="submission_asset_name">Nama Aset/Perkap</CFormLabel>
                                <CFormInput id="submission_asset_name" v-model="submission_asset_name" type="text"
                                    placeholder="Masukkan nama aset/perkap" />
                            </div>
                        </div>
                        <div class="mb-3 flex justify-between">
                            <div class="flex-1 mr-4">
                                <CFormLabel for="submission_role_name">Nama PIC Aset</CFormLabel>
                                <CFormInput id="submission_role_name" v-model="submission_role_name" type="text"
                                    placeholder="Masukkan nama PIC aset" />
                            </div>
                            <div class="flex-1">
                                <CFormLabel for="submission_area">Area Kerja</CFormLabel>
                                <CFormSelect id="submission_area" v-model="submission_area" aria-label="Pilih Area Kerja">
                                    <option value="" disabled selected>Pilih Area Kerja</option>
                                    <option v-for="area in areas" :key="area.areaId" :value="area.areaName">{{ area.areaName }}</option>
                                </CFormSelect>
                            </div>
                        </div>
                        <div class="mb-3 flex space-x-4">
                            <div class="flex-1">
                                <CFormLabel for="submission_category">Kategori Pengajuan</CFormLabel>
                                <CFormSelect id="submission_category" v-model="submission_category"
                                    aria-label="Pilih Kategori Pengajuan">
                                    <option value="" disabled selected>Pilih Kategori Pengajuan</option>
                                    <option value="Pengajuan Baru">Pengajuan Baru</option>
                                    <option value="Laporan Barang Hilang">Laporan Barang Hilang</option>
                                    <option value="Pengajuan Service">Pengajuan Service</option>
                                    <option value="Pengajuan Ganti">Pengajuan Ganti</option>
                                </CFormSelect>
                            </div>
                            <div class="flex-1">
                                <CFormLabel for="submission_outlet">Lokasi</CFormLabel>
                                <CFormSelect id="submission_outlet" v-model="submission_outlet" aria-label="Pilih Lokasi">
                                    <option value="" disabled selected>Pilih Lokasi</option>
                                    <option v-for="outlet in outlets" :key="outlet.outletId" :value="outlet.outletName">{{ outlet.outletName }}</option>
                                </CFormSelect>
                            </div>
                        </div>
                        <div class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="attachment">Lampiran (Bukti Aset)</CFormLabel>
                                <CFormInput id="attachment" ref="Attachment" type="file" accept="image/*"
                                    @change="handleFileChange" placeholder="Masukkan lampiran" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="submission_description">Keterangan Pengajuan Aset</CFormLabel>
                            <CFormTextarea id="submission_description" v-model="submission_description" rows="3"
                                placeholder="Masukkan keterangan">
                            </CFormTextarea>
                        </div>
                    </CForm>
                    <div class="flex justify-end mt-4">
                        <button
                            class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center"
                            type="button" @click="handleSubmit" :disabled="isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm mr-2" role="status"
                                aria-hidden="true"></span>
                            Submit
                        </button>
                    </div>
                    <CModal v-model="showUploadErrorModal" backdrop="static" keyboard="false">
                        <CModalHeader>
                            <CModalTitle>File Upload Error</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <p>File upload failed. Please upload a valid file.</p>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" @click="showUploadErrorModal = false">
                                Close
                            </CButton>
                        </CModalFooter>
                    </CModal>

                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton } from '@coreui/vue';

const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;

export default {
    data() {
        return {
            submission_asset_name: "",
            submission_outlet: "",
            submission_pr_name: "",
            submission_role_name: "",
            submission_category: "",
            submission_name: "",
            submission_description: "",
            submission_area: "",
            attachment: null,
            submission_status: "Diajukan",
            nip: "",
            isSubmitting: false, 
            showUploadErrorModal: false, 
            areas: [], // Tambahkan state untuk menyimpan data area
            outlets: [], // Tambahkan state untuk menyimpan data outlet
        };
    },

    created() {
        this.attachment = null;
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                this.submission_name = decodedToken.name;
                this.nip = decodedToken.sub;
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.warn("Token not found in localStorage");
        }

        this.fetchAreas(); // Panggil metode untuk mengambil data area saat komponen dibuat
        this.fetchOutlets(); // Panggil metode untuk mengambil data outlet saat komponen dibuat
    },
    methods: {
        handleSubmit() {
            console.log("Submit button clicked");
            this.submitForm();
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.attachment = file;
            } else {
                console.error("No file selected");
            }
        },

        async fetchAreas() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/areas`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.areas = response.data.data; // Sesuaikan dengan struktur respons
            } catch (error) {
                console.error("Error fetching areas:", error);
            }
        },

        async fetchOutlets() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/outlets`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.outlets = response.data.data; // Sesuaikan dengan struktur respons
            } catch (error) {
                console.error("Error fetching outlets:", error);
            }
        },

        async submitForm() {
            this.isSubmitting = true; 
            this.showUploadErrorModal = false; 

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token tidak ditemukan, silakan login terlebih dahulu.");
                this.isSubmitting = false;
                return;
            }

            let uploadedFilePath = null;

            try {
                const attachmentFormData = new FormData();
                attachmentFormData.append('file', this.attachment);

                const uploadResponse = await axios.post(
                    `${uploadUrl}/upload?module=Pengajuan`,
                    attachmentFormData,
                    {
                        headers: {
                            'X-API-KEY': 'bprfjocmaqfib592338vf',
                        },
                    }
                );

                if (uploadResponse.status === 204) {
                    console.error("File upload gagal dengan status 204.");
                    this.showUploadErrorModal = true; 
                    throw new Error("File upload gagal.");
                }

                uploadedFilePath = uploadResponse.data.file_path;
                console.log("Uploaded file path:", uploadedFilePath);

                const payload = {
                    asset_id: this.assetId,
                    submission_name: this.submission_name,
                    nip: this.nip,
                    submission_pr_name: this.submission_pr_name,
                    submission_asset_name: this.submission_asset_name,
                    submission_role_name: this.submission_role_name,
                    submission_area: this.submission_area,
                    submission_outlet: this.submission_outlet,
                    submission_category: this.submission_category,
                    submission_description: this.submission_description,
                    attachment: uploadedFilePath,
                    submission_status: this.submission_status,
                };

                console.log("Payload:", payload);
                const response = await axios.post(
                    `${apiUrl}/api/submissions`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    this.$router.push({ name: 'AsetList' });
                }
            } catch (error) {
                console.error("There was an error:", error.response ? error.response.data : error);

                if (uploadedFilePath) {
                    try {
                        await axios.delete(`${uploadUrl}/delete`, {
                            headers: {
                                'X-API-KEY': 'bprfjocmaqfib592338vf',
                            },
                            data: {
                                file_path: uploadedFilePath,
                            },
                        });
                        console.log("Uploaded file has been rolled back successfully.");
                    } catch (deleteError) {
                        console.error("Failed to rollback uploaded file:", deleteError.response ? deleteError.response.data : deleteError);
                    }
                }
            } finally {
                this.isSubmitting = false; 
            }
        }

    }
};
</script>

<style scoped>
.c-modal {
    display: block !important;
}
</style>