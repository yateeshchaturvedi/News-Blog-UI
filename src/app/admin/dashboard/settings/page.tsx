import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage general site settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>General settings will be available here.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of your site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Appearance settings will be available here.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>Connect your social media accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Social media settings will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
