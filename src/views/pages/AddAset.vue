<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Tambah Data Aset</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">

                        <div class="mb-3">
                            <CFormLabel for="asset_name">Nama Aset</CFormLabel>
                            <CFormInput id="asset_name" v-model="asset_name" type="text"
                                placeholder="masukkan nama aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_brand">Nama Merk</CFormLabel>
                            <CFormInput id="asset_brand" v-model="asset_brand" type="text"
                                placeholder="masukkan merk aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_image">Lampiran (Gambar Aset)</CFormLabel>
                            <CFormInput id="asset_image" ref="assetImage" type="file" accept="image/*"
                                placeholder="masukkan gambar aset jpg,jpeg, png" @change="handleFileChange" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_specification">Spesifikasi Aset</CFormLabel>
                            <CFormTextarea id="asset_specification" v-model="asset_specification" rows="3">
                            </CFormTextarea>
                        </div>

                        <div v-if="isKlasifikasiaRequired" class="mb-4">
                            <CFormLabel for="asset_classification">Pilih Klasifikasi</CFormLabel>
                            <select id="asset_classification" v-model="selectedKlasifikasi"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchKlasifikasi">
                                <option value="">Pilih Klasifikasi</option>
                                <option v-for="klasifikasi in klasifikasis" :key="klasifikasi.classificationId"
                                    :value="klasifikasi.classificationId">
                                    {{ klasifikasi.classificationName }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <CFormLabel for="personal_responsible">Penanggung Jawab</CFormLabel>
                            <CFormInput id="personal_responsible" v-model="personal_responsible" type="text"
                                placeholder="masukkan penanggung jawab" />
                        </div>

                        <div class="mb-3 flex space-x-8">
                            <div>
                                <CFormLabel for="asset_condition">Kondisi Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <CFormCheck id="Baru" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Baru" label="Baru" />
                                    <CFormCheck id="Bekas" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Bekas" label="Bekas" />
                                </div>
                            </div>

                            <div>
                                <CFormLabel for="asset_status">Status Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <CFormCheck id="Baik" v-model="asset_status" type="radio" name="asset_status"
                                        value="Baik" label="Baik" />
                                    <CFormCheck id="Buruk" v-model="asset_status" type="radio" name="asset_status"
                                        value="Buruk" label="Buruk" />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_purchase_date">Tanggal Pembelian Aset</CFormLabel>
                            <CFormInput id="asset_purchase_date" v-model="asset_purchase_date" type="date"
                                placeholder="masukkan tanggal pembelian aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="classification_acquisition_value">Nilai Perolehan Aset</CFormLabel>
                            <CFormInput id="classification_acquisition_value" v-model="classification_acquisition_value"
                                type="number" placeholder="masukkan nilai perolehan" />
                        </div>

                        <div v-if="isAreaRequired" class="mb-4">
                            <CFormLabel for="area_id">Pilih Area</CFormLabel>
                            <select id="area_id" v-model="selectedArea"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                                <option value="">Pilih Area</option>
                                <option v-for="area in areas" :key="area.areaId" :value="area.areaId">
                                    {{ area.areaName }}
                                </option>
                            </select>
                        </div>

                        <div v-if="isOutletRequired" class="mb-4">
                            <CFormLabel for="outlet_id">Pilih Lokasi</CFormLabel>
                            <select id="outlet_id" v-model="selectedOutlet"
                                class="border border-gray-300 rounded-lg p-2 w-full">
                                <option value="">Pilih Lokasi</option>
                                <option v-for="outlet in outlets" :key="outlet.outletId" :value="outlet.outletId">{{
                                    outlet.outletName }}</option>
                            </select>
                        </div>

                        <div v-if="isPicRequired" class="mb-4">
                            <CFormLabel for="asset_pic">Pilih PIC Aset</CFormLabel>
                            <select id="asset_pic" v-model="selectedPic"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                                <option value="">Pilih PIC</option>
                                <option v-for="role in PicOption" :key="role.roleId" :value="role.roleId">
                                    {{ role.roleName }}
                                </option>
                            </select>
                        </div>

                        <div class="flex justify-end mt-4">
                            <button
                                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center"
                                type="submit">Submit</button>
                        </div>

                    </CForm>

                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>
<script>
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;
export default {
    data() {
        return {
            asset_name: "",
            asset_brand: "",
            asset_image: null,
            PicOption: [],
            selectedPic: "",
            selectedArea: "",
            selectedOutlet: "",
            selectedKlasifikasi: "",
            areas: [],
            outlets: [],
            klasifikasis: [],
            personals: [],
            asset_condition: "Baru",
            asset_purchase_date: "",
            asset_status: "",
            asset_pic: "",
            personal_responsible: "",
            classification_acquisition_value: "",
            isAreaRequired: true,
            isOutletRequired: true,
            isKlasifikasiaRequired: true,
            isPicRequired: true,
            isPersonalRequired: true,
        };
    },
    created() {
        this.fetchOutlets();
        this.fetchAreas();
        this.fetchPic();
        this.fetchKlasifikasi();
        this.asset_classification = "";
        this.asset_name = "";
        this.asset_brand = "";
        this.asset_image = null;
        this.asset_specification = "";
        this.selectedPic = "";
        this.personal_responsible = "";
        this.selectedArea = "";
        this.selectedOutlet = "";
        this.asset_condition = "Baru";
        this.asset_purchase_date = "";
        this.asset_status = "Baik";
        this.classification_acquisition_value = "";
    },

    methods: {
        fetchKlasifikasi() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/classifications", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Klasifikasi fetched:", response.data.data);
                    this.klasifikasis = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching klasifikasi:", error);
                    this.klasifikasis = [];
                });
        },

        fetchAreas() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl+ "/api/areas", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Areas fetched:", response.data.data);
                    this.areas = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching areas:", error);
                    this.areas = [];
                });
        },

        fetchOutlets() {
            if (!this.selectedArea) return;
            const token = localStorage.getItem("token");
            axios
                .get(`${apiUrl}/api/outlets?area_id=${this.selectedArea}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => (this.outlets = response.data.data))
                .catch(() => (this.outlets = []));
        },

        fetchPic() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/roles", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Fetched roles:", response.data.data);
                    this.PicOption = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching roles:", error);
                    this.PicOption = [];
                });
        },

        handleSubmit() {
            console.log("Submit button clicked");
            this.submitForm();
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.asset_image = file;
                console.log("File selected:", file);
            }
        },

        async submitForm() {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            let uploadedFilePath = null;
            try {
                const imageFormData = new FormData();
                imageFormData.append('file', this.asset_image);

                const uploadResponse = await axios.post(`${uploadUrl}/upload?module=Master%20Aset`, imageFormData, {
                    headers: {
                        'X-API-KEY': 'bprfjocmaqfib592338vf',
                    },
                });

                uploadedFilePath = uploadResponse.data.file_path;

                console.log("Uploaded file path:", uploadedFilePath);

                const payload = {
                    asset_name: this.asset_name,
                    personal_responsible: this.personal_responsible,
                    asset_brand: this.asset_brand,
                    asset_image: uploadedFilePath,
                    asset_specification: this.asset_specification,
                    asset_condition: this.asset_condition,
                    asset_status: this.asset_status,
                    asset_purchase_date: this.asset_purchase_date,
                    classification_acquisition_value: this.classification_acquisition_value,
                    outlet_id: this.selectedOutlet,
                    area_id: this.selectedArea,
                    asset_pic: this.selectedPic,
                    asset_classification: this.selectedKlasifikasi,
                };

                console.log("Payload:", payload);

                const assetResponse = await axios.post(apiUrl + "/api/assets", payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Form submitted successfully", assetResponse.data);

                this.$router.push('/pages/AsetList');
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
            }
        }
    }
};
</script>
