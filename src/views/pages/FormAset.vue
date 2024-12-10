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
                                    <option value="Non-Maintenance">Pengabaian (Non-Maintenance)</option>
                                </CFormSelect>
                            </div>
                            <div class="flex-1">
                                <CFormLabel for="submission_outlet">Outlet</CFormLabel>
                                <CFormInput id="submission_outlet" v-model="submission_outlet" type="text"
                                    placeholder="kosong jika tidak ada" readonly />
                            </div>
                        </div>
                        <div class="mb-3 flex items-center justify-between">
                            <div class="flex-1">
                                <CFormLabel for="attachment">Lampiran (Bukti Aset)</CFormLabel>
                                <CFormInput id="attachment" type="file" accept="/*" @change="handleFileChange"
                                    placeholder="Masukkan lampiran" />
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
                            @click.prevent="submitForm">Submit</button>
                    </div>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
    data() {
        return {
            assetId: this.$route.params.id,
            submission_asset_name: "",
            submission_outlet: "",
            submission_pr_name: "",
            submission_role_name: "",
            submission_category: "",
            submission_name: "",
            submission_description: "",
            submission_area: "",
            attachment: "",
            nip: "",
        };
    },

    created() {
        this.fetchAssetData(this.assetId);
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwt_decode(token); // Decode token
                this.submission_name = decodedToken.name; // Sesuaikan dengan struktur payload token
                this.nip = decodedToken.sub; // Sesuaikan dengan struktur payload token
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.warn("Token not found in localStorage");
        }
    },
    methods: {
        async fetchAssetData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/assets/${this.assetId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response Data:", response.data);
                if (response.status === 200 && response.data && response.data.data) {
                    const assetData = response.data.data;
                    this.submission_asset_name = assetData.assetName || '';
                    this.submission_pr_name = assetData.assetPicName || '';
                    this.submission_role_name = assetData.personalName || '';
                    this.submission_outlet = assetData.outletName || '';
                    this.submission_area = assetData.areaName || '';
                }
            } catch (error) {
                console.error("Error fetching asset data:", error);
            }
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.attachment = file;
            }
        },

        async submitForm() {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            const formData = new FormData();
            formData.append("submission_name", this.submission_name);
            formData.append("nip", this.nip);
            formData.append("submission_pr_name", this.submission_pr_name);
            formData.append("submission_asset_name", this.submission_asset_name);
            formData.append("submission_role_name", this.submission_role_name);
            formData.append("submission_area", this.submission_area);
            formData.append("submission_outlet", this.submission_outlet);
            formData.append("submission_category", this.submission_category);
            formData.append("submission_description", this.submission_description);
            if (this.attachment) {
                formData.append("lampiran", this.attachment);
            }

            try {
                const response = await axios.post("http://localhost:8080/api/submissions", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 200) {
                    console.log("Pengajuan berhasil dibuat:", response.data);
                } else {
                    console.error("Gagal membuat pengajuan.");
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengirimkan form:", error);
            }
        },
    },
};
</script>
