-- Create a storage bucket for portfolio assets
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Set up access policies for the bucket
-- Allow public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'portfolio' );

-- Allow authenticated users to upload files
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'portfolio' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete their own files (or all files if admin)
create policy "Authenticated Manage"
on storage.objects for all
using (
  bucket_id = 'portfolio'
  and auth.role() = 'authenticated'
);
