<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Tambah Data Aset/Perkap</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">

                        <div v-if="isKlasifikasiaRequired" class="mb-4">
                            <CFormLabel for="asset_classification">Pilih Klasifikasi</CFormLabel>
                            <select id="asset_classification" v-model="selectedKlasifikasi"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="handleKlasifikasiChange"
                                required>
                                <option value="">Pilih Klasifikasi</option>
                                <option v-for="klasifikasi in klasifikasis" :key="klasifikasi.classificationId"
                                    :value="klasifikasi.classificationId">
                                    {{ klasifikasi.classificationName }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="asset_name">Nama Aset/Perkap</CFormLabel>
                            <div v-if="selectedKlasifikasi == 9">
                                <select id="asset_name" v-model="selectedAsset"
                                    class="border border-gray-300 rounded-lg p-2 w-full" required>
                                    <option value="">Pilih Nama Aset</option>
                                    <option v-for="asset in assets" :key="asset.id_asset_naming" :value="asset">
                                        {{ asset.assetNaming }}
                                    </option>
                                </select>
                            </div>
                            <div v-else>
                                <CFormInput id="asset_name" v-model="asset_name" type="text"
                                    placeholder="masukkan nama aset/perkap" required />
                            </div>
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_brand">Nama Merk Aset/Perkap</CFormLabel>
                            <CFormInput id="asset_brand" v-model="asset_brand" type="text"
                                placeholder="masukkan merk aset/perkap" required />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_image">Lampiran (Gambar Aset)</CFormLabel>
                            <CFormInput id="asset_image" ref="assetImage" type="file" accept="image/*"
                                placeholder="masukkan gambar aset/perkap jpg,jpeg, png" @change="handleFileChange"
                                required />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_specification">Spesifikasi Aset/Perkap </CFormLabel>
                            <CFormTextarea id="asset_specification" v-model="asset_specification" rows="3"
                                placeholder="masukkan spesifikasi/komponent/ukuran aset/perkap" required>
                            </CFormTextarea>
                        </div>

                        <div class="mb-4">
                            <CFormLabel for="personal_responsible">Penanggung Jawab</CFormLabel>
                            <CFormInput id="personal_responsible" v-model="personal_responsible" type="text"
                                placeholder="masukkan penanggung jawab/pengguna aset/perkap" required />
                        </div>

                        <div class="mb-3 flex space-x-8">
                            <div>
                                <CFormLabel for="asset_condition">Kondisi Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <CFormCheck id="Baru" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Baru" label="Baru" required />
                                    <CFormCheck id="Bekas" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Bekas" label="Bekas" required />
                                </div>
                            </div>

                            <div>
                                <CFormLabel for="asset_status">Status Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <CFormCheck id="Baik" v-model="asset_status" type="radio" name="asset_status"
                                        value="Baik" label="Baik" required />
                                    <CFormCheck id="Buruk" v-model="asset_status" type="radio" name="asset_status"
                                        value="Buruk" label="Buruk" required />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_purchase_date">Tanggal Pembelian Aset</CFormLabel>
                            <CFormInput id="asset_purchase_date" v-model="asset_purchase_date" type="date"
                                placeholder="masukkan tanggal pembelian aset" required />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="classification_acquisition_value">Nilai Perolehan Aset</CFormLabel>
                            <CFormInput id="classification_acquisition_value" :value="formattedAcquisitionValue"
                                @input="updateAcquisitionValue($event.target.value)" type="text"
                                placeholder="masukkan nilai perolehan" required />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_quantity_standar">Jumlah Standar Aset/Perkap </CFormLabel>
                            <CFormInput id="asset_quantity_standar" v-model="asset_quantity_standard" type="number"
                                placeholder="masukkan jumlah standar" required />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_quantity">Jumlah Aset/Perkap</CFormLabel>
                            <CFormInput id="asset_quantity" v-model="asset_quantity" type="number"
                                placeholder="masukkan jumlah aset/perkap" required />
                        </div>

                        <div v-if="isAreaRequired" class="mb-4">
                            <CFormLabel for="area_id">Pilih Area</CFormLabel>
                            <select id="area_id" v-model="selectedArea"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets" required>
                                <option value="">Pilih Area</option>
                                <option v-for="area in areas" :key="area.areaId" :value="area.areaId">
                                    {{ area.areaName }}
                                </option>
                            </select>
                        </div>

                        <div v-if="isOutletRequired" class="mb-4">
                            <CFormLabel for="outlet_id">Pilih Lokasi</CFormLabel>
                            <select id="outlet_id" v-model="selectedOutlet"
                                class="border border-gray-300 rounded-lg p-2 w-full" required>
                                <option value="">Pilih Lokasi</option>
                                <option v-for="outlet in outlets" :key="outlet.outletId" :value="outlet.outletId">{{
                                    outlet.outletName }}</option>
                            </select>
                        </div>

                        <div v-if="isPicRequired" class="mb-4">
                            <CFormLabel for="asset_pic">Pilih PIC Aset</CFormLabel>
                            <select id="asset_pic" v-model="selectedPic"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets" required>
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

    <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
    </div>
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
            asset_quantity_standard: "", // Inisialisasi sebagai string kosong
            asset_quantity: "", // Inisialisasi sebagai string kosong
            isAreaRequired: true,
            isOutletRequired: true,
            isKlasifikasiaRequired: true,
            isPicRequired: true,
            isPersonalRequired: true,
            loading: false, // Tambahkan state untuk loading
            assets: [], // Tambahkan state untuk assets
            selectedAsset: null,
            manualAssetName: "",
        };
    },
    computed: {
        formattedAcquisitionValue() {
            return this.classification_acquisition_value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
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
        this.asset_quantity_standard = ""; // Inisialisasi sebagai string kosong
        this.asset_quantity = ""; // Inisialisasi sebagai string kosong
    },

    methods: {
        fetchKlasifikasi() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/classification", { headers: { Authorization: `Bearer ${token}` } })
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
                .get(apiUrl + "/api/areas", { headers: { Authorization: `Bearer ${token}` } })
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

        fetchAssets() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/mstAssets", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Assets fetched:", response.data.data);
                    this.assets = response.data.data.map(asset => ({
                        id_asset_naming: asset.idAssetNaming,
                        assetNaming: asset.assetNaming,
                        classificationId: asset.classificationId
                    }));
                })
                .catch((error) => {
                    console.error("Error fetching assets:", error);
                    this.assets = [];
                });
        },

        handleKlasifikasiChange() {
            console.log("Selected Klasifikasi:", this.selectedKlasifikasi);
            if (this.selectedKlasifikasi == 9) {
                console.log("Item Perkap selected");
                this.fetchAssets();
            } else {
                this.selectedAsset = null;
                this.asset_name = "";
            }
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
        updateAcquisitionValue(value) {
            this.classification_acquisition_value = value.replace(/\./g, '');
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        },

        async submitForm() {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
                return;
            }

            this.loading = true; // Set loading to true when submit starts

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
                    assets: [
                        {
                            asset_name: this.selectedKlasifikasi == 9 ? this.selectedAsset.assetNaming : this.asset_name,
                            id_asset_naming: this.selectedKlasifikasi == 9 ? parseInt(this.selectedAsset.id_asset_naming) || null : null,
                            personal_responsible: this.personal_responsible,
                            asset_brand: this.asset_brand,
                            asset_image: uploadedFilePath,
                            asset_specification: this.asset_specification,
                            asset_condition: this.asset_condition,
                            asset_status: this.asset_status,
                            asset_purchase_date: this.formatDate(this.asset_purchase_date),
                            classification_acquisition_value: this.classification_acquisition_value,
                            asset_quantity_standard: parseInt(this.asset_quantity_standard),
                            asset_quantity: parseInt(this.asset_quantity),
                            outlet_id: this.selectedOutlet,
                            area_id: this.selectedArea,
                            asset_pic: this.selectedPic,
                            asset_classification: this.selectedKlasifikasi
                        }
                    ]
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
            } finally {
                this.loading = false; // Set loading to false when submit ends
            }
        }
    }
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