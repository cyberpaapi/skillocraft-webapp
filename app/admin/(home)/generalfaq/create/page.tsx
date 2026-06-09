'use client';

import GeneralFaqForm from '@/components/forms/GeneralFaqForm';
import { Card, CardContent } from '@/components/ui/card';

export default function CreateGeneralFaqPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create General FAQ</h1>
          <p className="text-muted-foreground">Add a new General FAQ to your site</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <GeneralFaqForm />
        </CardContent>
      </Card>
    </div>
  );
}
