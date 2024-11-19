import React, { useState, useEffect } from 'react'
import {
  Card,
  Box,
  Button,
  TextField,
  Checkbox,
  Typography,
  Menu,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material'
import Sortingquestion from './Sortingquestion'
import SortingType from './SortingType'
// import Router, { withRouter } from 'next/router'
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
import useCategoryApi from '@/api/useCategoryApi'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
const CategoryItem = ({ category, handleCategoryClick, clickedCategories, handleCategoryTitle }) => {
  // Check if the category is clicked and should display subcategories
  const isCategoryClicked = clickedCategories.includes(category.id)
  console.log(category.title, 'categorytitle')
  return (
    <li
      className='category-item'

      // onClick={() => handleCategoryTitle(category.id)}
    >
      <button
        className='category-button'
        onClick={e => {
          // e.stopPropagation() // Prevents the event from bubbling up unnecessarily
          handleCategoryTitle(category) // Call the function to update the selected category
          // handleCategoryClick(category.id) // Expand/collapse subcategories
        }}
      >
        {category.title}
        {/* Render the icon only if the category has children */}
        {category.children && category.children.length > 0 && (
          <span className='icon' onMouseOver={() => handleCategoryClick(category.id)}>
            &#9656;
          </span>
        )}
      </button>

      {/* Render the subcategory dropdown if the category is clicked */}
      {isCategoryClicked && category.children && category.children.length > 0 && (
        <ul className='subcategory-dropdown'>
          {category.children.map(subCategory => (
            <CategoryItem
              key={subCategory.id}
              category={subCategory}
              handleCategoryClick={handleCategoryClick}
              clickedCategories={clickedCategories} // Pass the updated clicked categories
              handleCategoryTitle={handleCategoryTitle} // Pass as subcategory
            />
          ))}
        </ul>
      )}
    </li>
  )
}

const Topcard = ({
  handleStatusToggle,
  handleSortChange,
  onDeleteClick,
  deleteIconActive,
  searchKeyword,
  handleSearch,
  showCorrectAnswer,
  setShowCorrectAnswer,
  showCategory,
  setShowCategory,
  showFields,
  setShowFields,
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
  handleCategoryTitle,
  handleCategoryChange,
  isDropdownOpen,
  trashDatalength,
  // Sortingquestion,
  setIsDropdownOpen,
  handleDropdownToggle,
  handleCategoryClick,
  clickedCategories,
  allquestionlength,
  trash
  // handleCategoryClick
}) => {
  const [anchorElOptions, setAnchorElOptions] = React.useState(null)
  const [anchorElSort, setAnchorElSort] = React.useState(null)
  const [searchValue, setSearchValue] = React.useState('')
  const [sortOptions, setSortOptions] = useState({
    creationAsc: false,
    creationDesc: false,
    questionAsc: false,
    questionDesc: false,
    multipleChoice: false,
    trueFalse: false
  })
  const [isFilterActive, setIsFilterActive] = useState(false)

  // const [categories, setCategories] = useState([])
  // const [selectedCategory, setSelectedCategory] = useState('')
  // const [selectedCategory, setSelectedCategory] = useState('Category')
  const { data } = useCategoryApi()
  // const router = useRouter()
  useEffect(() => {
    const hasActiveFilter = searchKeyword || Object.values(sortOptions).some(option => option)
    setIsFilterActive(hasActiveFilter)
  }, [searchKeyword, sortOptions])
  useEffect(() => {
    const savedShowCorrectAnswer = localStorage.getItem('showCorrectAnswer')
    if (savedShowCorrectAnswer !== null) {
      setShowCorrectAnswer(JSON.parse(savedShowCorrectAnswer)) // Parse the string as boolean
    }
  }, [setShowCorrectAnswer])

  // Save the "showCorrectAnswer" state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('showCorrectAnswer', JSON.stringify(showCorrectAnswer))
  }, [showCorrectAnswer])
  const handleOptionsClick = event => {
    setAnchorElOptions(event.currentTarget)
  }
  const router = useRouter()
  const handleSortClick = event => {
    setAnchorElSort(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElOptions(null)
    setAnchorElSort(null)
  }
  // const parseCategories = (categories, level = 0) => {
  //   return categories.flatMap(category => [
  //     { id: category.id, title: category.title, level },
  //     ...parseCategories(category.children || [], level + 1)
  //   ])
  // }
  // useEffect(() => {
  //   if (data) {
  //     console.log(data, 'data12334')
  //     const parsedCategories = parseCategories(data)
  //     setCategories(parsedCategories)
  //   }
  // }, [data])
  console.log(categories, 'categorydata')
  // Handle category selection
  // const handleCategoryChange = event => {
  //   const value = event.target.value
  //   setSelectedCategory(value)
  //   console.log('Selected Category ID:', value)
  // }
  const handleCheckboxChange = event => {
    const { name, checked } = event.target
    setSortOptions(prevOptions => ({
      ...prevOptions,
      [name]: checked // Only update the checkbox clicked
    }))
  }
  const handleShowCorrectAnswerChange = () => {
    setShowCorrectAnswer(prev => !prev) // Toggle the value of showCorrectAnswer
  }
  const handleShowCategoryChange = () => {
    setShowCategory(prev => !prev) // Toggle the value of showCorrectAnswer
  }
  const handleShowFieldChange = () => {
    setShowFields(prev => !prev) // Toggle the value of showCorrectAnswer
  }
  const handleResetFilters = () => {
    setSearchValue('')
    setSortOptions({
      creationAsc: false,
      creationDesc: false,
      questionAsc: false,
      questionDesc: false,
      multipleChoice: false,
      trueFalse: false
    })
    handleSearch({ target: { value: '' } })
  }

  // const isFilterActive = () => {
  //   return searchValue !== '' || Object.values(sortOptions).some(value => value === true)
  // }
  console.log(
    Object.values(sortOptions).some(option => option),
    'aaaa'
  )
  // const selectCategoriesPage = () => {
  //   console.log('Navigating to:', '/categories/list')

  //   router.push(
  //     {
  //       pathname: '/categories/list',
  //       query: { category: 'check' } // still using query here if needed
  //     },
  //     undefined,
  //     { state: { category: 'check' } }
  //   )
  // }
  // const router = useRouter()

  // useEffect(() => {
  //   // Add any effect needed for router changes
  // }, [router])
  const handleImport = () => {
    router.push('/question/selectcategory')
  }
  // const [hoveredCategory, setHoveredCategory] = useState(null)

  // const handleMouseEnter = categoryId => {
  //   setHoveredCategory(categoryId)
  // }

  // const handleMouseLeave = categoryId => {
  //   // Prevent resetting the hover state if hovering over a subcategory
  //   if (hoveredCategory === categoryId) {
  //     setHoveredCategory(null)
  //   }
  // }
  // const [clickedCategories, setClickedCategories] = useState([]) // Track which category is clicked

  // Handle category click to toggle the visibility of its subcategories
  // const handleCategoryClick = categoryId => {
  //   setClickedCategories(prevClickedCategories => {
  //     if (prevClickedCategories.includes(categoryId)) {
  //       // If the category is already clicked, remove it (collapse it)
  //       return prevClickedCategories.filter(id => id !== categoryId)
  //     } else {
  //       // If not clicked, add it to the list of clicked categories
  //       return [...prevClickedCategories, categoryId]
  //     }
  //   })
  // }
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // // Handle the toggle of the category dropdown
  // const handleDropdownToggle = () => {
  //   setIsDropdownOpen(!isDropdownOpen)
  // }
  // const handleCategoryTitle = category => {
  //   console.log('1234')
  //   console.log(category, 'selected category')
  //   setSelectedCategory(category.title)
  //   // Update the selected category based on whether it's a parent or subcategory
  //   // if (isSubcategory) {
  //   //   console.log(selectedCategory, 'sssss')
  //   //   setSelectedCategory(category.title)
  //   // } else {
  //   //   // Only set the parent category if it's explicitly clicked
  //   //   setSelectedCategory(category.title)
  //   // }

  //   setIsDropdownOpen(false)
  // }
  return (
    // <Card
    //   sx={{
    //     padding: '20px',
    //     borderRadius: '15px',
    //     border: '1px solid #d3d3d3',
    //     boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    //     width: '100%',
    //     marginBottom: '20px',
    //     boxSizing: 'border-box'
    //   }}
    // >
    <>
      <Grid item xs={3}>
        <Typography fontWeight='bold' fontSize={18}>
          Filter
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {/* Row 1: Search Input */}
        <div className='dropdown-container' style={{ marginTop: '8px' }}>
          <div className='dropdown-toggle' onClick={handleDropdownToggle}>
            {selectedCategory}
          </div>
          {isDropdownOpen && (
            <ul className='category-dropdown'>
              {data.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  // handleMouseEnter={handleMouseEnter}
                  // handleMouseLeave={handleMouseLeave}
                  // hoveredCategory={hoveredCategory}
                  handleCategoryClick={handleCategoryClick}
                  clickedCategories={clickedCategories}
                  handleCategoryTitle={handleCategoryTitle}
                />
              ))}
            </ul>
          )}
        </div>
        <Grid item xs={12} md={3}>
          <TextField
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: 'auto'
              },
              '& .MuiInputLabel-root': {
                top: '-7px'
              }
            }}
            // variant='outlined'
            placeholder='Search'
            fullWidth
            value={searchKeyword}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <i className='ri-search-line' style={{ color: '#262B4366' }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Row 1: Action Buttons */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            '& .MuiInputBase-root': {
              height: '40px',
              minHeight: 'auto'
            },
            '& .MuiInputLabel-root': {
              top: '-7px'
            }
          }}
        >
          <Box display='flex' justifyContent='flex-end' flexWrap='wrap' gap={1}>
            {/* <FormControl variant='outlined' sx={{ minWidth: 90 }}>
              <InputLabel>Type</InputLabel>
              <Select label='Type' onClick={handleSortClick}>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    name='multipleChoice'
                    checked={sortOptions.multipleChoice}
                    onChange={handleCheckboxChange}
                  />
                  Multiple Choice
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox name='trueFalse' checked={sortOptions.trueFalse} onChange={handleCheckboxChange} />
                  True/False
                </MenuItem>
              </Select>
            </FormControl> */}
            <Grid sx={{ ml: 4 }}>
              <Box sx={{ ml: 4 }}>
                <SortingType onSortChange={handleSortChange} />
              </Box>
            </Grid>
            {/* <Button variant='contained' color='primary'> */}
            <FormControl variant='outlined' sx={{ minWidth: 90 }}>
              <InputLabel>Test</InputLabel>
              <Select
                label='Sort Questions'
                onClick={handleSortClick}
                // IconComponent={ArrowDropDownIcon}
              >
                {/* <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox name='creationAsc' checked={sortOptions.creationAsc} onChange={handleCheckboxChange} />
                  Creation Date Ascending
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox name='creationDesc' checked={sortOptions.creationDesc} onChange={handleCheckboxChange} />
                  Creation Date Descending
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox name='questionAsc' checked={sortOptions.questionAsc} onChange={handleCheckboxChange} />
                  Question Ascending
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox name='questionDesc' checked={sortOptions.questionDesc} onChange={handleCheckboxChange} />
                  Question Descending
                </MenuItem> */}
              </Select>
            </FormControl>
            {/* </Button> */}
            {isFilterActive && (
              <Button variant='text' color='error' onClick={handleResetFilters}>
                Reset Filter
              </Button>
            )}
          </Box>
        </Grid>

        {/* Row 2: Options and Sort Questions */}
        <Grid item xs={12}>
          <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
            <Box display='flex' gap={1}>
              <Button
                color='secondary'
                // variant='outlined'
                // className='max-sm:is-full'
                // onClick={e => handleDeleteClick(e, 1)}
                style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px' }}
                onClick={onDeleteClick}
              >
                <i
                  className='ri-delete-bin-6-line'
                  // style={{ color: '#8080808C' }}
                  style={{ color: deleteIconActive ? '#007AFF' : '#8080808C' }}
                  // onClick={e => handleDeleteClick(e, 1)}
                />
              </Button>
              {trash && (
                <Button
                  color='secondary'
                  // variant='outlined'
                  // className='max-sm:is-full'
                  // onClick={e => handleDeleteClick(e, 1)}
                  style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px' }}
                  onClick={onDeleteClick}
                >
                  <i
                    className='ri-reset-left-line'
                    // style={{ color: '#8080808C' }}
                    style={{ color: deleteIconActive ? '#007AFF' : '#8080808C' }}
                    // onClick={e => handleDeleteClick(e, 1)}
                  />
                </Button>
              )}
              {!trash && (
                <>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                  >
                    {/* <i className='ri-menu-add-line' style={{ fontSize: '24px' }} /> */}
                    <i class='ri-checkbox-multiple-line' style={{ fontSize: '24px' }} />
                    <span className='hover-text'>Select All</span>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                  >
                    <i className='ri-menu-add-line' style={{ fontSize: '24px' }} />
                    <span className='hover-text'>Add in Test</span>
                  </Box>

                  {/* Import */}
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                  >
                    <i className='ri-download-2-line' style={{ fontSize: '24px' }} onClick={handleImport} />
                    <span className='hover-text'>Import</span>
                  </Box>

                  {/* Export */}
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                  >
                    <i className='ri-upload-2-line' style={{ fontSize: '24px' }} />
                    <span className='hover-text'>Export</span>
                  </Box>
                </>
              )}
            </Box>

            <Box display='flex' alignItems='center' flexWrap='wrap' gap={2}>
              {/* Options Dropdown */}
              <Button
                aria-controls='options-menu'
                aria-haspopup='true'
                onClick={handleOptionsClick}
                endIcon={<i class='ri-arrow-down-s-line' />}
              >
                Options
              </Button>
              <Menu id='options-menu' anchorEl={anchorElOptions} open={Boolean(anchorElOptions)} onClose={handleClose}>
                <MenuItem onClick={handleShowCorrectAnswerChange}>
                  <Checkbox checked={showCorrectAnswer} /> Show Correct Answers
                </MenuItem>
                <MenuItem>
                  <Checkbox /> Show Test Name
                </MenuItem>
                <MenuItem onClick={handleShowCategoryChange}>
                  <Checkbox checked={showCategory} /> Show Category
                </MenuItem>
                <MenuItem onClick={handleShowFieldChange}>
                  <Checkbox checked={showFields} /> Show Marks, Negative Marks, Time
                </MenuItem>
              </Menu>

              {/* Sort Questions Dropdown */}
              {/* <FormControl variant='outlined' sx={{ minWidth: 120 }}>
                <InputLabel>Sort Questions</InputLabel>
                <Select
                  label='Sort Questions'
                  onClick={handleSortClick}
                  // IconComponent={ArrowDropDownIcon}
                >
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='creationAsc' checked={sortOptions.creationAsc} onChange={handleCheckboxChange} />
                    Creation Date Ascending
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='creationDesc' checked={sortOptions.creationDesc} onChange={handleCheckboxChange} />
                    Creation Date Descending
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='questionAsc' checked={sortOptions.questionAsc} onChange={handleCheckboxChange} />
                    Question Ascending
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='questionDesc' checked={sortOptions.questionDesc} onChange={handleCheckboxChange} />
                    Question Descending
                  </MenuItem>
                </Select>
              </FormControl> */}
              <Sortingquestion onSortChange={handleSortChange} />
              {/* Reset Filter Button */}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='flex-end'
            className='hover-container'
            style={{ position: 'relative' }}
          >
            <Typography
              onClick={() => handleStatusToggle('active')}
              style={{ marginRight: '20px' }} // Add spacing between the elements
            >
              Active {allquestionlength}
            </Typography>
            <Typography onClick={() => handleStatusToggle('trash')}>Trash {trashDatalength}</Typography>
          </Box>
        </Grid>
      </Grid>
    </>
    // </Card>
  )
}

export default Topcard
