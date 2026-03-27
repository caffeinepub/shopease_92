import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, LogIn, Plus, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { CATEGORIES } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  category: "Clothing",
  brand: "",
  rating: "4.5",
  stockCount: "100",
  imageUrl: "",
};

export function AdminPanel({ open, onClose, products }: AdminPanelProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<bigint | null>(null);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const setField = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: String(Number(p.price)),
      category: p.category,
      brand: p.brand,
      rating: String(p.rating),
      stockCount: String(Number(p.stockCount)),
      imageUrl: p.imageUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      price: BigInt(Math.round(Number(form.price))),
      category: form.category,
      brand: form.brand,
      rating: Number(form.rating),
      stockCount: BigInt(Math.round(Number(form.stockCount))),
      imageUrl: form.imageUrl,
    };
    try {
      if (editId !== null) {
        await updateProduct.mutateAsync({ id: editId, update: payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync({ ...payload, id: 0n });
        toast.success("Product created");
      }
      setForm(EMPTY_FORM);
      setEditId(null);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Panel
          </DialogTitle>
        </DialogHeader>

        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Shield className="w-12 h-12 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">
              Login to access the admin panel
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="gap-2"
              data-ocid="admin.primary_button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </div>
        ) : !isAdmin ? (
          <div
            className="flex flex-col items-center justify-center py-12 gap-2"
            data-ocid="admin.error_state"
          >
            <Shield className="w-12 h-12 text-sale opacity-40" />
            <p className="font-medium">Access Denied</p>
            <p className="text-sm text-muted-foreground">
              You don't have admin privileges.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="border border-border rounded-xl p-4 space-y-4"
              data-ocid="admin.panel"
            >
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                {editId !== null ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    required
                    data-ocid="admin.input"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    rows={2}
                    data-ocid="admin.textarea"
                  />
                </div>
                <div>
                  <Label className="text-xs">Price ($)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    required
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setField("category", v)}
                  >
                    <SelectTrigger data-ocid="admin.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Brand</Label>
                  <Input
                    value={form.brand}
                    onChange={(e) => setField("brand", e.target.value)}
                    required
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    value={form.stockCount}
                    onChange={(e) => setField("stockCount", e.target.value)}
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label className="text-xs">Rating (0–5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setField("rating", e.target.value)}
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setField("imageUrl", e.target.value)}
                    placeholder="https://..."
                    data-ocid="admin.input"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="gap-2"
                  data-ocid="admin.submit_button"
                >
                  {(createProduct.isPending || updateProduct.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editId !== null ? "Update Product" : "Add Product"}
                </Button>
                {editId !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm(EMPTY_FORM);
                      setEditId(null);
                    }}
                    data-ocid="admin.cancel_button"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            {/* Products table */}
            <div>
              <h3 className="font-semibold text-sm mb-3">
                Products ({products.length})
              </h3>
              <div className="border border-border rounded-xl overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 20).map((p, i) => (
                      <TableRow
                        key={String(p.id)}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-medium text-sm max-w-[180px] truncate">
                          {p.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          ${Number(p.price)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {String(p.stockCount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEdit(p)}
                              data-ocid={`admin.edit_button.${i + 1}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(p.id)}
                              disabled={deleteProduct.isPending}
                              data-ocid={`admin.delete_button.${i + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                          data-ocid="admin.empty_state"
                        >
                          No products yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
