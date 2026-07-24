const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [stock, setStock] = useState("");
const [categoryId, setCategoryId] = useState("");
const [isOnSale, setIsOnSale] = useState(false);

const [file, setFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
