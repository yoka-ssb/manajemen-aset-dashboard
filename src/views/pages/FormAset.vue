<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Formulir Data Aset</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">
                        <div class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="submission_name">Nama Pengaju</CFormLabel>
                                <CFormInput id="submission_name" v-model="submission_name" type="text"
                                    placeholder="nama pengaju auto value" readonly />
                            </div>
                            <div class="flex-1 ml-4">
                                <CFormLabel for="nip">NIP</CFormLabel>
                                <CFormInput id="nip" v-model="nip" type="text" placeholder="NIP auto value" readonly />
                            </div>
                        </div>
                        <div class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="submission_pr_name">Nama Penanggung Jawab Aset</CFormLabel>
                                <CFormInput id="submission_pr_name" v-model="submission_pr_name" type="text"
                                    placeholder="nama penanggung jawab aset auto value" readonly />
                            </div>
                            <div class="flex-1 ml-4">
                                <CFormLabel for="submission_asset_name">Nama Aset</CFormLabel>
                                <CFormInput id="submission_asset_name" v-model="submission_asset_name" type="text"
                                    placeholder="nama aset auto value" readonly />
                            </div>
                        </div>
                        <div class="mb-3 flex justify-between">
                            <div class="flex-1 mr-4">
                                <CFormLabel for="submission_role_name">Nama PIC Aset</CFormLabel>
                                <CFormInput id="submission_role_name" v-model="submission_role_name" type="text"
                                    placeholder="nama pic aset auto value" readonly />
                            </div>
                            <div class="flex-1">
                                <CFormLabel for="submission_area">Area Kerja</CFormLabel>
                                <CFormInput id="submission_area" v-model="submission_area" type="text"
                                    placeholder="kosong jika tidak ada" readonly />
                            </div>
                        </div>
                        <div class="mb-3 flex space-x-4">
                            <div class="flex-1">
                                <CFormLabel for="submission_category">Kategori Pengajuan</CFormLabel>
                                <CFormSelect id="submission_category" v-model="submission_category"
                                    aria-label="Pilih Kategori Pengajuan">
                                    <option value="" disabled selected>Pilih Kategori Pengajuan</option>
                                    <option value="Laporan Barang Hilang">Laporan Barang Hilang</option>
                                    <option value="Pengajuan Service">Pengajuan Service</option>
                                    <option value="Pengajuan Ganti">Pengajuan Ganti</option>
                                    <option value="Pengabaian Kondisi Aset">Pengabaian Kondisi Aset</option>
                                    <option value="Pemenuhan Aset/Perkap">Pemenuhan Aset/Perkap</option>
                                </CFormSelect>
                                <p v-if="errors.submission_category" class="text-red-500 text-sm mt-1">{{
                                    errors.submission_category }}</p>
                            </div>
                            <div class="flex-1">
                                <CFormLabel for="submission_outlet">Lokasi</CFormLabel>
                                <CFormInput id="submission_outlet" v-model="submission_outlet" type="text"
                                    placeholder="kosong jika tidak ada" readonly />
                            </div>
                        </div>
                        <div v-if="showAdditionalFields" class="mb-3 flex space-x-4">
                            <div class="flex-1">
                                <CFormLabel for="submission_quantity">Jumlah</CFormLabel>
                                <CFormInput id="submission_quantity" v-model="submission_quantity" type="number"
                                    placeholder="Masukkan jumlah" required />
                                <p v-if="errors.submission_quantity" class="text-red-500 text-sm mt-1">{{
                                    errors.submission_quantity }}</p>
                            </div>
                            <div v-if="showAdditionalFields" class="flex-1">
                                <CFormLabel for="submission_price">Harga Satuan</CFormLabel>
                                <CFormInput id="submission_price" :value="formattedPrice"
                                    @input="updatePrice($event.target.value)" type="number"
                                    placeholder="Masukkan harga satuan" required />
                                <p v-if="errors.submission_price" class="text-red-500 text-sm mt-1">{{
                                    errors.submission_price }}</p>
                            </div>
                        </div>
                        <div v-if="showAdditionalFields" class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="attachment">Lampiran (Bukti Aset)</CFormLabel>
                                <CFormInput id="attachment" ref="Attachment" type="file" accept="image/*"
                                    @change="handleFileChange" placeholder="Masukkan lampiran" required />
                                <p v-if="errors.attachment" class="text-red-500 text-sm mt-1">{{ errors.attachment }}
                                </p>
                            </div>
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="submission_description">Keterangan Pengajuan Aset</CFormLabel>
                            <CFormTextarea id="submission_description" v-model="submission_description" rows="3"
                                placeholder="Masukkan keterangan" required>
                            </CFormTextarea>
                            <p v-if="errors.submission_description" class="text-red-500 text-sm mt-1">{{
                                errors.submission_description }}</p>
                        </div>
                    </CForm>
                    <div class="flex justify-end mt-4">
                        <button
                            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center ml-4"
                            type="button" @click="submitForm('submit')" :disabled="isSubmitting">
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

const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;

export default {
    data() {
        return {
            assetId: this.$route.params.id,
            submission_asset_name: "",
            submission_outlet: "",
            submission_pr_name: "",
            submission_role_name: "",
            submission_category: "", // Inisialisasi sebagai string kosong
            submission_name: "",
            submission_description: "",
            submission_area: "",
            submission_quantity: "", // Inisialisasi sebagai string kosong
            submission_price: "", // Inisialisasi sebagai string kosong
            attachment: null,
            submission_status: "Diajukan",
            nip: "",
            isSubmitting: false,
            showUploadErrorModal: false,
            outletId: null, // Tambahkan state untuk menyimpan outletId
            areaId: null, // Tambahkan state untuk menyimpan areaId
            errors: {}, // Tambahkan state untuk menyimpan pesan error per field
        };
    },

    computed: {
        showAdditionalFields() {
            return this.submission_category !== 'Pengabaian Kondisi Aset';
        },
        formattedPrice() {
            return this.submission_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    },

    created() {
        this.attachment = null;
        this.fetchAssetData(this.assetId);
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
    },

    methods: {
    handleSubmit() {
        this.submission_status = 'submit'; // Set status menjadi 'submit' untuk submit biasa
        this.submitForm(); // Panggil submitForm
    },
        async fetchAssetData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/assets/${this.assetId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response Data:", response.data);
                if (response.status === 200 && response.data && response.data.data) {
                    const assetData = response.data.data;
                    this.submission_asset_name = assetData.assetName || '';
                    this.submission_pr_name = assetData.personalResponsible || '';
                    this.submission_role_name = assetData.assetPicName || '';
                    this.submission_outlet = assetData.outletName || '';
                    this.submission_area = assetData.areaName || '';
                    this.outletId = assetData.outletId || null;
                    this.areaId = assetData.areaId || null;
                }
            } catch (error) {
                console.error("Error fetching asset data:", error);
            }
        },

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
        updatePrice(value) {
            this.submission_price = value.replace(/\./g, '');
        },

        async submitForm() {
            this.isSubmitting = true;

            // Hilangkan pesan error sebelum validasi
            this.errors = {};

            if (this.showAdditionalFields) {
                if (!this.submission_category) {
                    this.errors.submission_category = "Kategori Pengajuan harus dipilih!";
                }
                if (!this.submission_quantity) {
                    this.errors.submission_quantity = "Jumlah harus diisi!";
                }
                if (!this.submission_price) {
                    this.errors.submission_price = "Harga Satuan harus diisi!";
                }
                if (!this.attachment) {
                    this.errors.attachment = "Lampiran harus diunggah!";
                }
                if (!this.submission_description) {
                    this.errors.submission_description = "Keterangan Pengajuan Aset harus diisi!";
                }

                if (Object.keys(this.errors).length > 0) {
                    this.isSubmitting = false;
                    return;
                }
            }

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token tidak ditemukan, silakan login terlebih dahulu.");
                this.isSubmitting = false;
                return;
            }

            let uploadedFilePath = null;

            try {
                if (this.showAdditionalFields && this.attachment) {
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
                }

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
                    submission_status: this.submission_status,
                    outlet_id: this.outletId, // Tambahkan outlet_id yang dipilih
                    area_id: this.areaId, // Tambahkan area_id yang dipilih
                };

                if (this.showAdditionalFields) {
                    payload.submission_quantity = this.submission_quantity; // Tambahkan jumlah kebutuhan ke payload
                    payload.submission_price = this.submission_price; // Tambahkan harga satuan ke payload
                    payload.attachment = uploadedFilePath;
                }

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
                    console.log("Submission successful, redirecting to ListPengajuan...");
                    this.$router.push({ name: 'List Pengajuan' });
                } else {
                    console.error("Unexpected response status:", response.status);
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