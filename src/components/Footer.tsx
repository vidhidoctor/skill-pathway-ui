import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <GraduationCap className="h-5 w-5" />
            <span className="font-semibold">LearnHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 LearnHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
