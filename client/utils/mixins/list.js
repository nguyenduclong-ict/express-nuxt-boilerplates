import qs from 'qs'
import dayjs from '~/utils/dayjs'
import { omitBy, defaultsDeep, cloneDeep } from '~/utils/lodash'

const ListMixin = {
  filters: {
    date(value, format) {
      format = format || 'DD/MM/YYYY HH:mm'
      return dayjs(value).format(format)
    },
  },
  data() {
    return {
      api: '/',
      data: [],
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
      },
      filters: {},
      sort: [],
      select: undefined,
      search: '',
      default: {
        filters: {},
      },
    }
  },
  watch: {
    filters: {
      handler() {
        this.fetchData()
      },
      deep: true,
    },
  },
  created() {
    this.default.filters = cloneDeep(this.filters)
    this.restoreStateFromQuery()
    this.fetchData()
    this.$watch(this.changeUrl, [
      this.pagination,
      this.filters,
      this.sort,
      this.search,
      this.select,
    ])
  },
  methods: {
    restoreStateFromQuery() {
      let {
        _page,
        _page_size,
        _sort,
        _populates,
        _select,
        _search,
        ...filters
      } = qs.parse(location.search.replace('?', ''))

      if (_page !== undefined) this.pagination.page = +_page
      if (_page_size !== undefined) this.pagination.page_size = +_page_size
      if (_search !== undefined) this.search = _search
      if (_sort !== undefined) this.sort = _sort
      if (_populates !== undefined) this.populates = _populates
      if (_select !== undefined) this.select = _select
      if (_search !== undefined) this.search = _search
      Object.assign(this.filters, filters)
    },
    changeUrl() {
      let queryString = this.buildQuery({
        filters: this.filters,
        pagination: this.pagination,
        sort: this.sort,
        populates: this.populates,
        search: this.search,
      })
      if (queryString && !queryString.startsWith('?'))
        queryString = '?' + queryString

      if (queryString != location.search) {
        const nextURL = location.origin + location.pathname + queryString
        const nextTitle = 'My new page title'
        const nextState = { additionalInformation: 'Updated the URL with JS' }
        window.history.pushState(nextState, nextTitle, nextURL)
        window.history.replaceState(nextState, nextTitle, nextURL)
      }
    },
    async fetchData(params = {}) {
      defaultsDeep(
        params,
        cloneDeep({
          filters: this.filters,
          pagination: this.pagination,
          sort: this.sort,
          populates: this.populates,
          search: this.search,
        })
      )
      this.convertParams(params)
      const queryString = this.buildQuery({
        filters: params.filters,
        pagination: params.pagination,
        sort: params.sort,
        populates: params.populates,
        search: params.search,
      })
      const { data, ...pagination } = await this.$axios.$get(
        this.api + (queryString ? '?' + queryString : '')
      )
      Object.assign(this, { pagination })
      this.data = data
    },
    buildQuery({ filters, pagination, sort, populates, select, search } = {}) {
      return qs.stringify(
        omitBy(
          {
            ...filters,
            _page: pagination?.page,
            _page_size: pagination?.page_size,
            _sort: sort,
            _populates: populates,
            _select: select,
            _search: search,
          },
          (v) => v === undefined || v === ''
        )
      )
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pagination.page = Math.ceil(
        (this.pagination.page * this.pagination.page_size) / size
      )
      this.pagination.page_size = size
      this.fetchData()
    },
    resetFilter() {
      this.filters = cloneDeep(this.default.filters)
    },
    convertParams() {},
  },
}

export default ListMixin
