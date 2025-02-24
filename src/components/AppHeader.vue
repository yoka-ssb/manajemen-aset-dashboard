<script setup>
import { onMounted, ref, computed } from 'vue'
import { useColorModes } from '@coreui/vue'

import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import AppHeaderDropdownAccnt from '@/components/AppHeaderDropdownAccnt.vue'
import { useSidebarStore } from '@/stores/sidebar.js'
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton } from '@coreui/vue'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

import { useRouter } from 'vue-router'

const router = useRouter()

const headerClassNames = ref('mb-4 p-0')
const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
const sidebar = useSidebarStore()
const totalWaiting = ref(0)
const totalLate = ref(0)
const totalSubmitted = ref(0)
const showModal = ref(false)
const apiUrl = import.meta.env.VITE_API_URL

const outlet_id = ref(null)
const area_id = ref(null)
const role_id = ref(null)

const parseToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const decoded = jwt_decode(token)
    outlet_id.value = decoded.outlet_id
    area_id.value = decoded.area_id
    role_id.value = decoded.role_id
    console.log('Outlet ID:', outlet_id.value)
    console.log('Area ID:', area_id.value)
    console.log('Role ID:', role_id.value)
  } else {
    console.error('Token not found in local storage')
  }
}

const fetchAllNotifications = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.post(`${apiUrl}/api/notifications/all`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      console.log('All notifications fetched successfully:', response.data)
    } else {
      console.error('Failed to fetch all notifications:', response.status)
    }
  } catch (error) {
    console.error('Error fetching all notifications:', error)
  }
}

const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    // Make sure parseToken is called before fetching notifications
    parseToken()

    // Prepare the payload based on the role_id
    let params = {
      role_id: role_id.value,
    }

    if (role_id.value === 5) {
      // For role_id 5, send role_id and area_id
      params = { ...params, area_id: area_id.value }
    } else if (role_id.value === 6) {
      // For role_id 6, send role_id and outlet_id
      params = { ...params, outlet_id: outlet_id.value }
    }

    // Send the request with the updated parameters
    const response = await axios.get(`${apiUrl}/api/notifications`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = response.data
    totalWaiting.value = data.totalWaiting
    totalLate.value = data.totalLate
    totalSubmitted.value = data.totalSubmitted
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    totalWaiting.value = 0
    totalLate.value = 0
  }
}

const notificationCount = computed(() => {
  if (role_id.value === 5 || role_id.value === 6) {
    return totalWaiting.value + totalLate.value
  } else {
    return totalWaiting.value + totalLate.value + totalSubmitted.value
  }
})

onMounted(() => {
  document.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 0) {
      headerClassNames.value = 'mb-4 p-0 shadow-sm'
    } else {
      headerClassNames.value = 'mb-4 p-0'
    }
  })

  fetchAllNotifications()

  fetchNotifications()
})

const showConfirmationModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false;
  router.push('/pages/Notification');
};

</script>

<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="border-bottom px-4" fluid>
      <CHeaderToggler @click="sidebar.toggleVisible()" style="margin-inline-start: -14px">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex">
        <div class="sidebar-brand-full text-grey">
          <strong class="text-xl">Management Aset</strong>
        </div>
      </CHeaderNav>
      <CHeaderNav class="ms-auto">
        <CNavItem class="position-relative" @click="showConfirmationModal">
          <CNavLink href="#">
            <CIcon icon="cil-bell" size="lg" />
            <span v-if="notificationCount > 0"
              class="badge bg-danger position-absolute top-0 start-100 translate-middle">
              {{ notificationCount }}
            </span>
          </CNavLink>
        </CNavItem>
      </CHeaderNav>

      <!-- Modal -->
      <CModal :visible="showModal">
        <CModalHeader>
          <CModalTitle>Notifikasi Maintenance</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p v-if="totalWaiting > 0">Anda memiliki {{ totalWaiting }} jadwal maintenance terdekat!</p>
          <p v-if="totalLate > 0">Anda memiliki {{ totalLate }} jadwal maintenance terlewat!</p>
          <p v-if="role_id !== 5 && role_id !== 6 && totalSubmitted > 0">Ada pengajuan {{ totalSubmitted }} masuk!</p>
          <!-- <p v-if="role_id !== 5 && role_id !== 6 && totalSubmitted > 0">Pantau Status {{ totalSubmitted }} Pengajuan Anda!</p> -->
        </CModalBody>

        <CModalFooter>
          <button class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 mr-2" @click="closeModal">
            Selengkapnya
          </button>
        </CModalFooter>
      </CModal>

      <CHeaderNav>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
            <CIcon v-else icon="cil-contrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem :active="colorMode === 'light'" class="d-flex align-items-center" component="button"
              type="button" @click="setColorMode('light')">
              <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem :active="colorMode === 'dark'" class="d-flex align-items-center" component="button"
              type="button" @click="setColorMode('dark')">
              <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem :active="colorMode === 'auto'" class="d-flex align-items-center" component="button"
              type="button" @click="setColorMode('auto')">
              <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CContainer class="px-4" fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>