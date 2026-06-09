'use client';

import { Card, CardContent } from '@/components/ui/card';
import CreateBlogForm from '@/components/forms/CreateBlogForm';

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Blog Post</h1>
          <p className="text-muted-foreground">Add a new blog post to your site</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CreateBlogForm />
        </CardContent>
      </Card>
    </div>
  );
}
