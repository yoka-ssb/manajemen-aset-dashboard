import { defineComponent, h, onMounted, ref, resolveComponent, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'
import jwt_decode from 'jwt-decode'

// Normalisasi path untuk menyamakan format
const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

// Mengecek apakah link aktif
const isActiveLink = (route, link) => {
  if (!link) return false
  return route.hash === link || normalizePath(route.path) === normalizePath(link)
}

// Mengecek apakah item aktif
const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) return true
  if (item.items) return item.items.some((child) => isActiveItem(route, child))
  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)
    const sidebarKey = ref(0) // Reactive key for forcing re-render

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

    onMounted(() => {
      firstRender.value = false
      parseToken() // Panggil parseToken saat komponen dimount
    })

    // Watch for changes to force refresh
    watch(route, () => {
      sidebarKey.value += 1 // Change key to trigger re-render
    })

    // Fungsi untuk memfilter menu berdasarkan roleId
    const filterMenuByRole = (menu) => {
      // Jika roleId adalah 5 atau 6, sembunyikan menu tertentu
      if (role_id.value === 5 || role_id.value === 6) {
        if (menu.name === 'Masters' || menu.name === 'Buat Pengajuan') {
          return false; // Menyembunyikan menu
        }
      } else {
        // Jika roleId selain 5 dan 6, sembunyikan menu tertentu
        if (menu.name === 'Daftar Aset' || menu.name === 'Daftar Perkap' || menu.name === 'Scan Qr') {
          return false; // Menyembunyikan menu
        }
      }
      return true; // Menampilkan menu
    }

    const renderItem = (item) => {
      // Jika item tidak memenuhi filter berdasarkan roleId, kembalikan null
      if (!filterMenuByRole(item)) {
        return null;
      }

      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            visible: item.items && item.items.some((child) => isActiveItem(route, child)),
          },
          {
            togglerContent: () => [
              h(
                resolveComponent('CIcon') || 'div', // Gunakan fallback jika `CIcon` tidak ada
                {
                  customClassName: 'nav-icon',
                  name: item.icon || '', // Fallback untuk ikon kosong
                },
              ),
              item.name || '', // Fallback jika `name` tidak ada
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component) || 'div',
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon') || 'span', {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon-bullet' }),
                      item.name || '',
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color || 'secondary', // Fallback warna badge
                          },
                          {
                            default: () => item.badge.text || '',
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component) || 'div',
            {
              as: 'div',
            },
            {
              default: () => item.name || '', // Fallback jika `name` kosong
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
          key: sidebarKey.value, 
        },
        {
          default: () => nav.map((item) => renderItem(item)), 
        },
      )
  },
})

export { AppSidebarNav }