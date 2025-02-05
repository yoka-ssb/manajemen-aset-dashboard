<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Formulir Pengajuan Baru</strong>
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
                                <CFormLabel for="submission_pr_name">Penanggung Jawab Aset/Perkap</CFormLabel>
                                <CFormInput id="submission_pr_name" v-model="submission_pr_name" type="text"
                                    placeholder="Masukkan nama penanggung jawab/Pengguna" />
                            </div>
                            <div class="flex-1 ml-4">
                                <CFormLabel for="submission_asset_name">Nama Aset/Perkap</CFormLabel>
                                <CFormInput id="submission_asset_name" v-model="submission_asset_name" type="text"
                                    placeholder="Masukkan nama aset/perkap" />
                            </div>
                        </div>
                        <div class="mb-3 flex justify-between">
                            <div class="flex-1 mr-4">
                                <CFormLabel for="submission_role_name">Nama PIC</CFormLabel>
                                <CFormInput id="submission_role_name" v-model="submission_role_name" type="text"
                                    placeholder="Masukkan nama PIC aset/perkap" />
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
                                    <option value="Pengajuan Penambahan Asset/Perkap">Pengajuan Penambahan Asset/Perkap</option>
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
                        <div class="mb-3 flex space-x-4">
                            <div class="flex-1">
                                <CFormLabel for="submission_quantity">Jumlah</CFormLabel>
                                <CFormInput id="submission_quantity" v-model="submission_quantity" type="number"
                                    placeholder="Masukkan jumlah pengajuan" />
                            </div>
                            <div class="flex-1">
                                <CFormLabel for="submission_price">Harga Satuan</CFormLabel>
                                <CFormInput id="submission_price" v-model="submission_price" type="number"
                                    placeholder="Masukkan harga satuan" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="submission_description">Keterangan Pengajuan</CFormLabel>
                            <CFormTextarea id="submission_description" v-model="submission_description" rows="3"
                                placeholder="Masukkan keterangan pengajuan asset/perkap">
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
            submission_quantity: 0, // Tambahkan state untuk menyimpan jumlah pengajuan
            submission_price: 0, // Tambahkan state untuk menyimpan harga satuan
            attachment: null,
            submission_status: "Diajukan",
            nip: "",
            isSubmitting: false, 
            showUploadErrorModal: false, 
            areas: [], 
            outlets: [], 
        };
    },

    created() {
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

        this.fetchAreas();
        this.fetchOutlets();
    },
    methods: {
        handleSubmit() {
            console.log("Submit button clicked");
            this.submitForm();
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
                this.areas = response.data.data;
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
                this.outlets = response.data.data; 
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

            try {

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
                    submission_quantity: this.submission_quantity, // Tambahkan jumlah pengajuan ke payload
                    submission_price: this.submission_price, // Tambahkan harga satuan ke payload
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