import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Mail, Phone, Book, Award, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const YouPage: React.FC = () => {
  const { student } = useAuth();

  if (!student) {
    return (
      <Layout>
        <div className="p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">No student data available</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-6 pb-20">
        {/* Profile Header */}
        <div className="text-center mb-6 mt-28">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-4">
            <User className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{student.name}</h2>
          <p className="text-muted-foreground text-sm">{student.usn}</p>
        </div>

        {/* Academic Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Academic Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium text-foreground">{student.branch}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">Semester</span>
              <span className="font-medium text-foreground">{student.semester}th</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">Section</span>
              <span className="font-medium text-foreground">{student.section}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">CGPA</span>
              <span className="font-medium text-accent flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md">
                <Award className="h-4 w-4" />
                {student.cgpa}
              </span>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-accent" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                 <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-medium text-foreground">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                 <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                <p className="font-medium text-foreground">{student.phone}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-gradient-primary text-primary-foreground border-0 text-center shadow-lg shadow-primary/20">
            <p className="text-3xl font-bold mb-1">{student.semester}</p>
            <p className="text-xs opacity-80 uppercase tracking-widest">Sem</p>
          </Card>
          <Card className="p-4 bg-gradient-accent text-accent-foreground border-0 text-center shadow-lg shadow-accent/20">
            <p className="text-3xl font-bold mb-1">{student.cgpa}</p>
            <p className="text-xs opacity-80 uppercase tracking-widest">CGPA</p>
          </Card>
          <Card className="p-4 text-center hover:bg-white/5 transition-colors">
            <p className="text-3xl font-bold text-foreground mb-1">{student.section}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Sec</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default YouPage;
