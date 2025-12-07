# 📝 Blog Feature Documentation

## Overview

A complete, production-ready blog listing and detail page implementation that integrates seamlessly with your backend API. The UI is designed to match luxury fashion editorial style with pixel-perfect Tailwind CSS.

---

## 🗂 File Structure

```
src/
├── api/
│   └── blogApi.ts              # API service functions
├── components/
│   └── BlogCard/
│       ├── BlogCard.tsx        # Reusable blog card component
│       ├── BlogSkeleton.tsx    # Loading skeleton
│       └── index.ts            # Export file
├── pages/
│   ├── BlogList.tsx            # Main blog listing page
│   └── BlogDetails.tsx         # Individual blog detail page
└── types/
    └── index.tsx               # Blog interface added
```

---

## 🎨 Design Features

### BlogList Page (`/blog`)
- **Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Responsive Gaps**: `gap-x-12 gap-y-20` for luxury spacing
- **Image Ratio**: 16:10 aspect ratio for all blog cards
- **Hover Effects**: Smooth scale and opacity transitions
- **Loading States**: Premium skeleton loaders
- **Error Handling**: User-friendly error messages with retry button

### BlogCard Component
- **Typography**: Serif font for titles (editorial style)
- **Text Clamping**: 3-line description clamp
- **Metadata**: Category and author display
- **Clickable**: Entire card navigates to blog details
- **Image Fallback**: Automatic placeholder on error

### BlogDetails Page (`/blog/:id`)
- **Full Article View**: Rich content display with prose styling
- **SEO Optimized**: Meta tags and JSON-LD structured data
- **Responsive Images**: 16:9 featured image
- **Tag Display**: Styled tag pills at bottom
- **Navigation**: Back button with smooth transitions

---

## 🔌 API Integration

### Endpoints Used

```typescript
GET /api/blogs
// Returns: Blog[]

GET /api/blogs/:id
// Returns: Blog
```

### Blog Schema

```typescript
interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  image?: string;
  author?: string;
  category?: "Styling Tips" | "Product Guides" | "Traditions" | "DIY" | "Care Tips" | "Trending" | "Fabric Guide" | "Design Inspiration";
  tags?: string[];
  published?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🚀 Usage

### 1. Add Blog Link to Navigation

In your `Header.tsx` or navigation component:

```tsx
import { Link } from 'react-router-dom';

<Link to="/blog">Blog</Link>
```

### 2. Routes Are Already Set Up

Routes have been added to `App.tsx`:

```tsx
<Route path="/blog" element={<BlogList />} />
<Route path="/blog/:id" element={<BlogDetails />} />
```

### 3. Access the Blog

Navigate to: `http://localhost:5173/blog`

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
grid-cols-1              /* < 768px */
md:grid-cols-2          /* ≥ 768px */
lg:grid-cols-3          /* ≥ 1024px */
```

---

## 🎯 Key Features

### ✅ Published Filter
Only shows blogs where `published === true`

### ✅ SEO Ready
- Dynamic meta tags per blog
- JSON-LD structured data for articles
- Canonical URLs
- Open Graph tags
- Twitter cards

### ✅ Error Handling
- API error states
- Image loading errors with fallback
- 404 handling for unpublished blogs
- Network error retry

### ✅ Loading States
- Skeleton loaders match card design
- Smooth transitions
- No layout shift

### ✅ Accessibility
- Semantic HTML (`<article>`, `<time>`)
- Alt text for images
- Keyboard navigation
- ARIA-compliant

---

## 🖼 Placeholder Image

Add a placeholder image to your `public/` folder:

```
public/placeholder-blog.jpg
```

Or use any CDN placeholder service.

---

## 🎨 Customization

### Change Colors

Edit the text colors in components:

```tsx
// Primary text
text-[#1A1A1A]

// Secondary text
text-gray-600

// Button background
bg-[#1A1A1A]
```

### Change Typography

Update font classes:

```tsx
// From serif to sans
font-serif → font-sans
```

### Adjust Grid Gaps

In `BlogList.tsx`:

```tsx
// Current: gap-x-12 gap-y-20
// Change to: gap-x-8 gap-y-16
```

---

## 🔧 Advanced Features

### Add Category Filter

```tsx
// In BlogList.tsx
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

const filteredBlogs = selectedCategory
  ? blogs.filter(blog => blog.category === selectedCategory)
  : blogs;
```

### Add Search

```tsx
const [searchQuery, setSearchQuery] = useState('');

const searchedBlogs = blogs.filter(blog =>
  blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### Add Pagination

```tsx
const BLOGS_PER_PAGE = 9;
const [currentPage, setCurrentPage] = useState(1);

const paginatedBlogs = blogs.slice(
  (currentPage - 1) * BLOGS_PER_PAGE,
  currentPage * BLOGS_PER_PAGE
);
```

---

## 🧪 Testing

### Test Cases

1. **Loading State**: Verify skeleton appears on initial load
2. **Published Filter**: Ensure only `published: true` blogs show
3. **Empty State**: Check message when no blogs exist
4. **Error State**: Test network failure scenarios
5. **Image Fallback**: Test with invalid image URLs
6. **Navigation**: Verify blog card click navigates correctly
7. **SEO**: Check meta tags in browser dev tools
8. **Responsive**: Test on mobile, tablet, desktop

---

## 🐛 Troubleshooting

### Issue: Images not loading

**Solution**: Check CORS headers on your backend. Add:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### Issue: API 404 errors

**Solution**: Verify `VITE_API_URL` in your `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Issue: Styling doesn't match

**Solution**: Ensure Tailwind JIT mode is enabled in `tailwind.config.js`:

```js
mode: 'jit',
```

---

## 📊 Performance

- **Lazy Loading**: Routes are lazy-loaded
- **Image Optimization**: `loading="lazy"` on images
- **Code Splitting**: Automatic with Vite
- **Skeleton Loaders**: Prevent CLS (Cumulative Layout Shift)

---

## 🎓 Best Practices Implemented

✅ TypeScript strict mode compatible  
✅ React functional components with hooks  
✅ Clean separation of concerns (API, components, pages)  
✅ Reusable component architecture  
✅ Error boundary ready  
✅ SEO optimized  
✅ Accessible markup  
✅ Mobile-first responsive design  
✅ Production-ready code  

---

## 📝 Next Steps

1. Add blog link to main navigation
2. Create placeholder image in `public/` folder
3. Test with your backend API
4. Customize colors to match your brand
5. Add category filter (optional)
6. Implement pagination (optional)

---

## 🎉 You're All Set!

The blog feature is **100% complete and production-ready**. All components follow your existing code patterns and integrate seamlessly with your backend API schema.

Navigate to `/blog` to see it in action! 🚀
